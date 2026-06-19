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

  return (
    <div className="container vh-100">
      <h1 className="text-center mt-4 mb-3 order_title">Stock Information</h1>
      <div className="d-flex justify-content-end">
        <StockModel />
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Eastern Date</th>
              <th>Eastern Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item) => (
              <tr key={item._id}>
                <td>
                  {products.map((p) => (
                    <div key={p.key}>{p.name}</div>
                  ))}
                </td>
                <td>
                  {products.map((p) => (
                    <div key={p.key}>
                      {item[p.key] !== undefined ? item[p.key] : '-'}
                    </div>
                  ))}
                </td>
                <td>{item.easternDate}</td>
                <td>{item.easternTime}</td>
                <td>
                  <button onClick={() => handleDeleteClick(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockInfoTable;
