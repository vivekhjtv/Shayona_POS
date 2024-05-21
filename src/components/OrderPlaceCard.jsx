import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderPlaceCard() {
  const [orderItems, setOrderItems] = useState([]);

  const getItemsFromDataBase = async () => {
    try {
      const response = await axios.get(
        // 'http://localhost:8000/api/items'
        `https://shayona-orders.vercel.app/api/items`
      );
      setOrderItems(response.data);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };
  useEffect(() => {
    // Call the function initially
    getItemsFromDataBase();
    // Set up interval to call the function every 5 seconds
    const intervalId = setInterval(getItemsFromDataBase, 5000);
    // Clean up function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleDone = async (order) => {
    try {
      // await axios.post(`http://localhost:8000/api/orders`, {
      await axios.post(`https://shayona-orders.vercel.app/api/orders`, {
        orders: order.items,
        date: order.date,
        time: order.time,
      });

      const itemId = order._id;
      await axios.delete(
        // `http://localhost:8000/api/items/${itemId}`
        `https://shayona-orders.vercel.app/api/items/${itemId}`
      );
      // After deletion, fetch the updated data
      getItemsFromDataBase();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container vh-100">
      <h1 className="text-center mt-4 mb-5 order_title">Orders</h1>
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
                  {order.items.map((item, itemIndex) => (
                    <div key={item._id}>
                      <h5 className="card-text order_itemList">
                        {item.name} - {item.quantity}
                      </h5>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-success ms-2 mt-3"
                  onClick={() => handleDone(order)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderPlaceCard;
