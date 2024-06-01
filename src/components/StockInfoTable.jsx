import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockModel from './StockModel';
function StockInfoTable() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Fetch stock data from the API
    const fetchStockData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stock');
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, []);

  const handleDeleteClick = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/stock/${itemId}`);
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
                  <div>Khichadi</div>
                  <div>Pav Bhaji</div>
                  <div>Papdi Lot</div>
                  <div>Cheese Pizza</div>
                  <div>Veg Pizza</div>
                  <div>Special Thali</div>
                </td>
                <td>
                  <div>{item.khichadi}</div>
                  <div>{item.pav_bhaji}</div>
                  <div>{item.lot}</div>
                  <div>{item.cheese_pizza}</div>
                  <div>{item.veg_pizza}</div>
                  <div>{item.thali}</div>
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
