import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderList() {
  const [orderItems, setOrderItems] = useState([]);

  const getItemsFromDataBase = async () => {
    try {
      const response = await axios.get(
        'https://nice-rose-squid-sock.cyclic.app/api/orders'
        // 'http://localhost:8000/api/orders'
      );
      setOrderItems(response.data);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  useEffect(() => {
    getItemsFromDataBase();
  }, []);

  return (
    <div className="container vh-100">
      <h1 className="text-center mt-4 mb-5 order_title">Orders List</h1>
      <div className="row row-cols-1 row-cols-md-3 justify-content-end">
        <div className="dropdown d-flex justify-content-end">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort by Items
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="#">
                Samosa
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Puff
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Dabeli
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Khichadi
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Papadi no lot
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Pav Bhaji
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-3">
        {orderItems.map((order, index) => (
          <div className="col mb-4" key={order._id}>
            <div className="card card_order text-bg-light">
              <div className="card-header order_header d-flex justify-content-between align-items-center">
                <div className="order_number">{`OrderNumber #00${
                  index + 1
                }`}</div>
                {
                  <div key={order._id}>
                    <div className="order_datetime">{`${order.time} - ${order.date} `}</div>
                  </div>
                }
              </div>
              <div className="card-body">
                <div className="item_container">
                  {order.orders.map((item, itemIndex) => (
                    <div key={item._id}>
                      <h5 className="card-text order_itemList">
                        {item.name} - {item.quantity}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;
