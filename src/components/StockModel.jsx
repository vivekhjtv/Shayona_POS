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
        className="btn btn-primary mb-2"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={fetchProducts} // Re-fetch products when opening modal to reflect latest menu configuration
      >
        Add Stokes
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Enter Quantity
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {products.map((product) => (
                  <div className="col-sm-6 mb-3" key={product._id}>
                    <label
                      htmlFor={`input-${product.key}`}
                      className="form-label model_input"
                    >
                      {product.name}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`input-${product.key}`}
                      placeholder={`Enter ${product.name} quantity`}
                      value={quantity[product.key] || ''}
                      onChange={(e) => handleChange(e, product.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={addQuantity}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StockModel;
