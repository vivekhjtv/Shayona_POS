import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function OrderList() {
  const [orderItems, setOrderItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);
  const items = [
    'All',
    'Samosa',
    'Puff',
    'Dabeli',
    'Khichadi',
    'Papadi no lot',
    'Pav Bhaji',
  ];

  const getItemsFromDataBase = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders');
      setOrderItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  useEffect(() => {
    getItemsFromDataBase();
  }, []);

  const handleItemClick = (itemName) => {
    setSelectedFilter(itemName);
    if (itemName === 'All') {
      setFilteredItems(orderItems);
    } else {
      const filteredOrders = orderItems.filter((order) =>
        order.orders.some((item) => item.name === itemName)
      );
      setFilteredItems(filteredOrders);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      const filteredOrders = orderItems.filter(
        (order) => order.date === formattedDate
      );
      setFilteredItems(filteredOrders);
    } else {
      setFilteredItems(orderItems);
    }
  };

  const calculateQuantity = (itemName) => {
    let quantity = 0;
    filteredItems.forEach((order) => {
      order.orders.forEach((item) => {
        if (item.name === itemName) {
          quantity += item.quantity;
        }
      });
    });
    return quantity;
  };

  return (
    <div className="container vh-100">
      <h1 className="text-center mt-4 mb-3 order_title">Orders List</h1>

      <div className="dropdown d-flex mb-4 justify-content-end">
        <button
          className="btn btn-dark dropdown-toggle me-3"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Sort by {selectedFilter} ({calculateQuantity(selectedFilter)})
        </button>
        <ul className="dropdown-menu">
          {items.map((itemName, index) => (
            <li key={index}>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => handleItemClick(itemName)}
              >
                {itemName}
              </button>
            </li>
          ))}
        </ul>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          isClearable
          customInput={
            <button className="btn btn-primary ps-4 pe-4">
              {selectedDate
                ? selectedDate.toISOString().split('T')[0]
                : 'Select Date'}
            </button>
          }
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((order, index) => (
              <tr key={order._id}>
                <td className="col-sm-3">{`OrderNumber #00${index + 1}`}</td>
                <td className="col-sm-3">{order.date}</td>
                <td className="col-sm-3">{order.time}</td>
                <td className="col-sm-3">
                  <ul className="orderListItem">
                    {order.orders.map((item, itemIndex) => (
                      <li
                        key={item._id}
                      >{`${item.name} - ${item.quantity}`}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;
