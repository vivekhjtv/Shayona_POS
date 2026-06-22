import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StockModel() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});

  const BASE_URL = process.env.REACT_APP_GLOBAL_URL;

  // Fetch configured items dynamically
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      setProducts(response.data);
      
      // Initialize quantity states
      const initialQty = {};
      response.data.forEach((p) => {
        initialQty[p.key] = '';
      });
      setQuantity(initialQty);
    } catch (error) {
      console.error('Error fetching products for stock entry:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e, key) => {
    setQuantity((prevState) => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };

  const addQuantity = async () => {
    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };

    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);

    // Build payload dynamically from active products
    const payload = {
      easternDate: easternDate,
      easternTime: easternTime,
    };
    products.forEach((p) => {
      payload[p.key] = quantity[p.key] || '0';
    });

    try {
      await axios.post(`${BASE_URL}/api/stock`, payload);

      // Reset quantities
      const resetQty = {};
      products.forEach((p) => {
        resetQty[p.key] = '';
      });
      setQuantity(resetQty);

      // Trigger a window reload to refresh the table if needed
      window.location.reload();
    } catch (error) {
      console.error('Error saving stock order:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-flex align-items-center gap-2 mb-3"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={fetchProducts} // Re-fetch products when opening modal to reflect latest menu configuration
        style={{ fontWeight: '600', padding: '10px 20px', borderRadius: '10px' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Update Stock Levels
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
            <div className="modal-header bg-dark text-white border-0" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', padding: '20px' }}>
              <h5 className="modal-title text-white mb-0" id="exampleModalLabel" style={{ fontWeight: '600' }}>
                Update Current Stock Levels
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              <p className="text-muted mb-4">
                Enter the latest count for each active product. Leave blank or enter 0 if out of stock.
              </p>
              <div className="row">
                {products.map((product) => (
                  <div className="col-sm-6 col-md-4 mb-3" key={product._id}>
                    <label
                      htmlFor={`input-${product.key}`}
                      className="form-label"
                      style={{ fontWeight: '500' }}
                    >
                      {product.name}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`input-${product.key}`}
                      placeholder={`Qty (e.g. 15)`}
                      value={quantity[product.key] || ''}
                      onChange={(e) => handleChange(e, product.key)}
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer border-0 p-3 bg-light" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary px-4 py-2"
                data-bs-dismiss="modal"
                style={{ borderRadius: '8px', fontWeight: '600' }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary px-4 py-2"
                onClick={addQuantity}
                data-bs-dismiss="modal"
                style={{ borderRadius: '8px', fontWeight: '600' }}
              >
                Save Stock Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StockModel;
