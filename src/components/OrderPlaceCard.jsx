import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function OrderPlaceCard() {
  const [orderItems, setOrderItems] = useState([]);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const prevOrderItems = useRef([]);
  const notificationSound = useRef(new Audio('alert.mp3'));

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

  const enableNotifications = () => {
    getItemsFromDataBase();
    notificationSound.current
      .play()
      .then(() => {
        notificationSound.current.pause();
        notificationSound.current.currentTime = 0;
        setIsNotificationEnabled(true);
      })
      .catch((error) => {
        console.error('Error enabling notification sound:', error);
      });
  };

  useEffect(() => {
    getItemsFromDataBase();
    const intervalId = setInterval(getItemsFromDataBase, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      prevOrderItems.current.length &&
      JSON.stringify(prevOrderItems.current) !== JSON.stringify(orderItems)
    ) {
      if (isNotificationEnabled) {
        notificationSound.current.play().catch((error) => {
          console.error('Error playing notification sound:', error);
        });
      }
    }
    prevOrderItems.current = orderItems;
  }, [orderItems, isNotificationEnabled]);

  const handleDone = async (order) => {
    try {
      await axios.post(
        'https://shayona-orders.vercel.app/api/orders',
        // `http://localhost:8000/api/orders`
        {
          orders: order.items,
          date: order.date,
          time: order.time,
        }
      );

      const itemId = order._id;
      await axios.delete(
        // `http://localhost:8000/api/items/${itemId}`
        `https://shayona-orders.vercel.app/api/items/${itemId}`
      );
      getItemsFromDataBase();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container vh-100">
      <h1 className="text-center mt-4 mb-5 order_title">Orders</h1>
      {!isNotificationEnabled && (
        <div className="text-center mb-4">
          <button className="btn btn-primary" onClick={enableNotifications}>
            Enable Notifications
          </button>
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-3">
        {orderItems.map((order, index) => (
          <div className="col mb-4" key={order._id}>
            <div className="card card_order text-bg-light">
              <div className="card-header order_header d-flex justify-content-between align-items-center">
                <div className="order_number">{`OrderNumber #00${
                  index + 1
                }`}</div>
                <div key={order._id}>
                  <div className="order_datetime">{`${order.time} - ${order.date} `}</div>
                </div>
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
