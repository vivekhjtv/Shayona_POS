import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderList() {
  const [orderItems, setOrderItems] = useState([]);

  const getItemsFromDataBase = async () => {
    try {
      const response = await axios.get(
        'https://nice-rose-squid-sock.cyclic.app/api/orders'
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
      <div className="row row-cols-1 row-cols-md-3">
        {orderItems.map((order, index) => (
          <div className="col mb-4" key={order._id}>
            <div className="card card_order text-bg-light">
              <div className="card-header order_number">{`OrderNumber #00${
                index + 1
              }`}</div>
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
