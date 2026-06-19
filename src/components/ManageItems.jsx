import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ManageItems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const BASE_URL = process.env.REACT_APP_GLOBAL_URL;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load menu items.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-generate key from name while typing
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!editingId) {
      const generatedKey = val
        .toLowerCase()
        .trim()
        .replace(/[_\s-]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      setKey(generatedKey);
    }
  };

  // --- Image upload helpers ---

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadedImageUrl(''); // reset previously uploaded URL so we re-upload
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const uploadImageToCloud = async () => {
    if (!imageFile) return null;
    if (uploadedImageUrl) return uploadedImageUrl; // already uploaded this session

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedImageUrl(res.data.url);
      return res.data.url;
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Image upload failed. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setKey('');
    setPrice('');
    setImageFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setKey(product.key);
    setPrice(product.price);
    setImagePreview(product.imageUrl || '');
    setUploadedImageUrl(product.imageUrl || '');
    setImageFile(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) { setError('Item Name is required.'); return; }
    if (!key.trim()) { setError('Item Key is required.'); return; }
    if (!/^[a-z0-9_]+$/.test(key)) {
      setError('Key must be lowercase letters, numbers, and underscores only.');
      return;
    }
    if (price === '' || isNaN(price) || Number(price) < 0) {
      setError('Please enter a valid positive price.');
      return;
    }

    try {
      setSaving(true);

      // Upload image first if a new file was selected
      let finalImageUrl = uploadedImageUrl;
      if (imageFile && !uploadedImageUrl) {
        finalImageUrl = await uploadImageToCloud();
        if (!finalImageUrl) return; // upload failed, error already set
      }

      const payload = {
        name: name.trim(),
        key: key.trim(),
        price: Number(price),
        imageUrl: finalImageUrl || '',
      };

      if (editingId) {
        await axios.put(`${BASE_URL}/api/products/${editingId}`, payload);
        setSuccess('Item updated successfully!');
      } else {
        await axios.post(`${BASE_URL}/api/products`, payload);
        setSuccess('New item added successfully!');
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      const errMsg = err.response?.data?.error || 'Failed to save menu item.';
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      setError('');
      setSuccess('');
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setSuccess('Item deleted successfully!');
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete item.');
    }
  };

  return (
    <div className="container mt-4 pb-5">
      <h1 className="text-center mb-4 order_title">Manage POS Menu Items</h1>

      {error && <div className="alert alert-danger alert-dismissible" role="alert">
        {error}
        <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close" />
      </div>}
      {success && <div className="alert alert-success alert-dismissible" role="alert">
        {success}
        <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close" />
      </div>}

      <div className="row g-4">
        {/* Left: items table */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4" style={{ borderRadius: '15px' }}>
            <h3 className="mb-3 summary_title">Menu Items</h3>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <p className="text-muted text-center my-4">No items configured yet. Add one →</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 60 }}>Image</th>
                      <th>Name</th>
                      <th>Key</th>
                      <th>Price</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.imageUrl || product.image || 'default_item.jpeg'}
                            alt={product.name}
                            style={{ width: 50, height: 40, objectFit: 'cover', borderRadius: 8 }}
                            onError={(e) => { e.target.src = 'default_item.jpeg'; }}
                          />
                        </td>
                        <td><strong>{product.name}</strong></td>
                        <td><code className="text-muted">{product.key}</code></td>
                        <td>${Number(product.price).toFixed(2)}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(product)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Add/Edit form */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4" style={{ borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
            <h3 className="mb-3 summary_title">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            <form onSubmit={handleSubmit}>

              {/* Drag & Drop Image Upload */}
              <div className="mb-3">
                <label className="form-label text-dark fw-semibold">Item Image</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#0d6efd' : '#ced4da'}`,
                    borderRadius: 12,
                    padding: imagePreview ? 6 : '20px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: dragOver ? '#e8f0fe' : '#fff',
                    transition: 'all 0.2s ease',
                    minHeight: 110,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{ maxHeight: 100, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }}
                    />
                  ) : (
                    <div>
                      <div style={{ fontSize: 32 }}>🖼️</div>
                      <div className="text-muted small mt-1">
                        {uploading ? 'Uploading…' : 'Drag & drop or click to upload'}
                      </div>
                      <div className="text-muted" style={{ fontSize: 11 }}>JPG, PNG, WEBP · max 5 MB</div>
                    </div>
                  )}
                </div>

                {imagePreview && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary mt-2 w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview('');
                      setUploadedImageUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    ✕ Remove image
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={(e) => handleImageSelect(e.target.files[0])}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mango Lassi"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Database Key</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. mango_lassi"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  disabled={!!editingId}
                  required
                />
                <div className="form-text" style={{ fontSize: 11 }}>Auto-generated. Lowercase, numbers, underscores.</div>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 3.50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {uploading ? 'Uploading image…' : saving ? 'Saving…' : editingId ? 'Update Item' : 'Add Item'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageItems;
