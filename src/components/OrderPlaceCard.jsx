import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function OrderPlaceCard() {
  const [orderItems, setOrderItems] = useState([]);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const prevOrderItems = useRef([]);
  const notificationSound = useRef(new Audio('alert.mp3'));

  const getItemsFromDataBase = async () => {
    try {
      // const response = await axios.get('http://localhost:8000/api/items');
      const response = await axios.get(
        'https://shayona-orders.vercel.app/api/items'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order items:', error);
      return [];
    }
  };

  const getStoreOrdersFromDataBase = async () => {
    try {
      // const response = await axios.get('http://localhost:8000/api/store-order');
      const response = await axios.get(
        'https://shayona-orders.vercel.app/api/store-order'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching store orders:', error);
      return [];
    }
  };

  const fetchAllOrders = async () => {
    const [items, storeOrders] = await Promise.all([
      getItemsFromDataBase(),
      getStoreOrdersFromDataBase(),
    ]);

    const formattedStoreOrders = storeOrders.map((order) => ({
      ...order,
      items: [
        { name: 'Samosa', quantity: order.samosa },
        { name: 'Puff', quantity: order.puff },
        { name: 'Dabeli', quantity: order.dabeli },
        { name: 'Lilwa', quantity: order.lilwa },
        { name: 'Patties', quantity: order.patties },
      ].filter((item) => item.quantity), // Remove items with no quantity
      customerName: order.store, // Set customerName based on store
      date: order.easternDate,
      time: order.easternTime,
    }));

    setOrderItems([...items, ...formattedStoreOrders]);
  };

  const enableNotifications = () => {
    fetchAllOrders();
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
    fetchAllOrders();
    const intervalId = setInterval(fetchAllOrders, 5000);
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
      console.log(order);
      // Determine if the order is a regular item or store order
      const isStoreOrder =
        order.customerName === 'Mandir' || order.customerName === 'Store';
      console.log(isStoreOrder);
      if (isStoreOrder) {
        // Store order logic
        console.log(isStoreOrder);
        // await axios.post('http://localhost:8000/api/store', {
        await axios.post('https://shayona-orders.vercel.app/api/store', {
          orders: order.items,
          customerName: order.customerName,
          date: order.date,
          time: order.time,
        });

        // Delete the store order from the store-order table
        const itemId = order._id;
        // await axios.delete(`http://localhost:8000/api/store-order/${itemId}`);
        await axios.delete(
          `https://shayona-orders.vercel.app/api/store-order/${itemId}`
        );
      } else {
        // Regular item logic
        // await axios.post('http://localhost:8000/api/orders', {
        await axios.post('https://shayona-orders.vercel.app/api/orders', {
          orders: order.items,
          customerName: order.customerName,
          date: order.date,
          time: order.time,
        });

        // Delete the order from the items table
        const itemId = order._id;
        // await axios.delete(`http://localhost:8000/api/items/${itemId}`);
        await axios.delete(
          `https://shayona-orders.vercel.app/api/items/${itemId}`
        );
      }

      fetchAllOrders();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cancelOrder = async (order) => {
    try {
      const isStoreOrder =
        order.customerName === 'Mandir' || order.customerName === 'Store';

      const itemId = order._id;
      // const deleteUrl = isStoreOrder
      //   ? `http://localhost:8000/api/store-order/${itemId}`
      //   : `http://localhost:8000/api/items/${itemId}`;
      const deleteUrl = isStoreOrder
        ? `https://shayona-orders.vercel.app/api/store-order/${itemId}`
        : `https://shayona-orders.vercel.app/api/items/${itemId}`;

      await axios.delete(deleteUrl);
      fetchAllOrders();
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const getOrderCardClass = (store) => {
    switch (store) {
      case 'mandir':
        return 'card card_order bg-mandir';
      case 'store':
        return 'card card_order bg-store';
      default:
        return 'card card_order bg-light';
    }
  };

  return (
    <div className="container-fluid vh-100">
      <h1 className="text-center mt-4 mb-5 order_title">Orders</h1>
      {!isNotificationEnabled && (
        <div className="text-center mb-4">
          <button className="btn btn-primary" onClick={enableNotifications}>
            Enable Notifications
          </button>
        </div>
      )}
      <div className="row row-cols-1 row-cols-md-5">
        {orderItems.map((order, index) => (
          <div className="col mb-4" key={order._id}>
            <div className={getOrderCardClass(order.customerName)}>
              <div className="card-header order_header d-flex justify-content-between align-items-center">
                <div className="order_number">{`OrderNumber #00${
                  index + 1
                }`}</div>
                <div key={order._id}>
                  <span className="customer_name">{order.customerName}</span>
                </div>
              </div>
              <div className="card-body">
                <div className="item_container">
                  {order.items.map((item, itemIndex) => (
                    <div key={item._id || item.name}>
                      <h5 className="card-text order_itemList">
                        {item.name} - {item.quantity}
                      </h5>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <button
                      type="button"
                      className="btn btn-success ms-2 mt-3"
                      onClick={() => handleDone(order)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger ms-2 mt-3"
                      onClick={() => cancelOrder(order)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                      </svg>
                    </button>
                  </div>
                  <div key={order._id}>
                    <div className="order_datetime">{`${order.time}`}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderPlaceCard;
