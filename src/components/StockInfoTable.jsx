import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockModel from './StockModel';
function StockInfoTable() {
  const [stockData, setStockData] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    
    // Fetch stock data from the API
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/stock`);
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    // Fetch dynamic products list
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchStockData();
    fetchProducts();
  }, []);

  const handleDeleteClick = async (itemId) => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      await axios.delete(`${BASE_URL}/api/stock/${itemId}`);
      setStockData(stockData.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting stock data:', error);
    }
  };

  const currentStock = stockData.length > 0 ? stockData[0] : {};

  return (
    <div className="container py-4" style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <h1 className="order_title mb-2 mb-md-0">Stock Inventory</h1>
        <StockModel />
      </div>

      {/* Current Stock Level Dashboard Grid */}
      <h3 className="summary_title mb-3">Current Stock Levels</h3>
      {products.length === 0 ? (
        <p className="text-muted">No products configured yet.</p>
      ) : (
        <div className="stock-grid mb-5">
          {products.map((product) => {
            const count = currentStock[product.key];
            const isStockTracked = count !== undefined && count !== null && count !== "";
            const countNum = isStockTracked ? Number(count) : null;
            
            let cardClass = "stock-card";
            let statusText = "Service Item";
            
            if (isStockTracked) {
              if (countNum <= 0) {
                cardClass += " out-of-stock-card";
                statusText = "Out of Stock";
              } else if (countNum <= 5) {
                cardClass += " low-stock-card";
                statusText = "Low Stock";
              } else {
                cardClass += " in-stock-card";
                statusText = "In Stock";
              }
            }

            return (
              <div className={cardClass} key={product._id}>
                <div className="item-label">{product.name}</div>
                <div className="stock-value">{isStockTracked ? countNum : "—"}</div>
                <div className="text-muted small mt-2" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {statusText}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Entry Log History */}
      <h3 className="summary_title mb-3">Stock Entry Logs</h3>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Logged Date</th>
              <th style={{ width: '20%' }}>Logged Time</th>
              <th style={{ width: '40%' }}>Stock Updates (Qty)</th>
              <th style={{ width: '15%' }} className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No stock entries logged.
                </td>
              </tr>
            ) : (
              stockData.map((item) => (
                <tr key={item._id}>
                  <td>{item.easternDate}</td>
                  <td>{item.easternTime}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {products.map((p) => {
                        const val = item[p.key];
                        const hasVal = val !== undefined && val !== null && val !== "";
                        if (hasVal && Number(val) > 0) {
                          return (
                            <span className="badge bg-secondary px-2 py-1" key={p.key} style={{ fontSize: '12px' }}>
                              {p.name}: <strong>{val}</strong>
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this stock entry log?")) {
                          handleDeleteClick(item._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockInfoTable;
