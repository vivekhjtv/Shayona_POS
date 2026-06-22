import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { formatItemName } from '../utils/format';

function OrderPlaceCard() {
  const [orderItems, setOrderItems] = useState([]);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const prevOrderItems = useRef([]);
  const notificationSound = useRef(new Audio('alert.mp3'));

  const getItemsFromDataBase = async () => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      const response = await axios.get(`${BASE_URL}/api/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order items:', error);
      return [];
    }
  };

  const getStoreOrdersFromDataBase = async () => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      const response = await axios.get(`${BASE_URL}/api/store-order`);
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
console.log(items)
    const formattedStoreOrders = storeOrders.map((order) => ({
      ...order,
      items: [
        { name: 'Samosa', quantity: order.samosa },
        { name: 'Puff', quantity: order.puff },
        { name: 'Dabeli', quantity: order.dabeli },
        { name: 'Lilwa', quantity: order.lilwa },
        { name: 'Patties', quantity: order.patties },
        { name: 'Veg Pizza', quantity: order.veg_pizza },
        { name: 'Cheese Pizza', quantity: order.cheese_pizza },
        { name: 'Khichadi', quantity: order.khichadi },
        { name: 'Papadi lot', quantity: order.papadi_no_lot },
        { name: 'Pav Bhaji', quantity: order.pav_bhaji },
      ].filter((item) => item.quantity && item.quantity !== '0'),
      customerName: order.store,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      console.log(order);
      // Determine if the order is a regular item or store order
      const isStoreOrder =
        order.customerName === 'Mandir' || order.customerName === 'Store';
      console.log(isStoreOrder);
      if (isStoreOrder) {
        // Store order logic
        console.log(isStoreOrder);
        await axios.post(`${BASE_URL}/api/store`, {
          orders: order.items,
          customerName: order.customerName,
          date: order.date,
          time: order.time,
        });

        // Delete the store order from the store-order table
        const itemId = order._id;
        await axios.delete(`${BASE_URL}/api/store-order/${itemId}`);
      } else {
        // Regular item logic
        await axios.post(`${BASE_URL}/api/orders`, {
          orders: order.items,
          customerName: order.customerName,
          date: order.date,
          time: order.time,
        });

        // Delete the order from the items table
        const itemId = order._id;
        await axios.delete(`${BASE_URL}/api/items/${itemId}`);
      }

      fetchAllOrders();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cancelOrder = async (order) => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      const isStoreOrder =
        order.customerName === 'Mandir' || order.customerName === 'Store';

      const itemId = order._id;
      const deleteUrl = isStoreOrder
        ? `${BASE_URL}/api/store-order/${itemId}`
        : `${BASE_URL}/api/items/${itemId}`;

      await axios.delete(deleteUrl);
      fetchAllOrders();
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const getOrderCardClass = (store) => {
    switch (store) {
      case 'Mandir':
        return 'card card_order bg-mandir';
      case 'Store':
        return 'card card_order bg-store';
      default:
        return 'card card_order bg-light-ticket';
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 px-3">
        <h1 className="order_title mb-0">Kitchen Orders Board</h1>
        <div>
          {!isNotificationEnabled ? (
            <button className="btn btn-primary px-4 py-2" onClick={enableNotifications}>
              🔔 Enable Order Alerts
            </button>
          ) : (
            <span className="badge bg-success px-3 py-2" style={{ fontSize: '13px' }}>
              🔔 Alerts Enabled
            </span>
          )}
        </div>
      </div>

      {orderItems.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 className="text-muted">No pending orders in the kitchen.</h3>
          <p className="text-muted">New orders will pop up here in real-time.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 px-3">
          {orderItems.map((order, index) => (
            <div className="col" key={order._id}>
              <div className={getOrderCardClass(order.customerName)}>
                <div className="card-header order_header d-flex justify-content-between align-items-start">
                  <div>
                    <div className="order_number">{`Ticket #0${index + 1}`}</div>
                    <div className="order_datetime">
                      {order.time.replace(/:\d{2}(?=\s)/, '')}
                    </div>
                  </div>
                  <span className="customer_name">{order.customerName}</span>
                </div>
                <div className="card-body">
                  <div className="item_container">
                    {order.items.map((item, itemIndex) => (
                      <div key={item._id || item.name} className="order_itemList d-flex justify-content-between">
                        <span>{formatItemName(item.name)}</span>
                        <strong className="text-primary">x{item.quantity}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-end align-items-center pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <button
                      type="button"
                      className="btn-done"
                      onClick={() => handleDone(order)}
                      title="Mark Complete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-5.446z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => cancelOrder(order)}
                      title="Cancel / Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderPlaceCard;
