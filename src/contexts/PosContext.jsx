import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const POSContext = createContext({});

const POSContextWrapper = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [notification, setNotification] = useState('');

  const addItemToLeftList = (itemName, price) => {
    const existingItem = selectedItems.find((item) => item.name === itemName);
    if (existingItem) {
      const updatedItems = selectedItems.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
      );
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems((prevItems) => [
        ...prevItems,
        { name: itemName, price: price, quantity: 1 },
      ]);
    }
  };

  const handlePlaceOrder = async (name) => {
    const customerField = document.getElementsByClassName('customer_name')[0];
    
    if (selectedItems.length === 0) {
      alert('Please Select Items');
      return;
    }

    if (!name) {
      alert('Please Enter Customer Name');
      // if (customerField) {
      //   customerField.style.border = '2px solid red'; // Highlight the field with red border
      // }
      return;
    }

    // // Reset border to original when customer name is provided
    // if (customerField) {
    //   customerField.style.border = '1px solid #ccc'; // Reset to the original border
    // }

    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };
    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);

    const postSelectedItemsToDataBase = async (items) => {
      try {
        await axios.post(`https://shayona-orders.vercel.app/api/items`, {
          items: items,
          customerName: name,
          date: easternDate,
          time: easternTime,
        });
      } catch (error) {
        console.error('Error adding items:', error);
      }
    };

    await postSelectedItemsToDataBase(selectedItems);
    setSelectedItems([]);
    setCustomerName('');
    
    // Show notification message
    setNotification('Thank you for your order. Your order is in preparation.');
    
    // Hide notification message after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleChange = (e) => {
    setCustomerName(e.target.value);
    
    // Reset border to original as user starts typing
    const customerField = document.getElementsByClassName('customer_name')[0];
    if (customerField) {
      customerField.style.border = '1px solid #ccc'; // Reset border to normal
    }
  };

  const contextValue = {
    addItemToLeftList,
    selectedItems,
    setSelectedItems,
    handlePlaceOrder,
    customerName,
    setCustomerName,
    notification, // Add notification to context
  };

  return (
    <POSContext.Provider value={contextValue}>
      {children}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </POSContext.Provider>
  );
};

export default POSContextWrapper;

export const usePOSContext = () => {
  const posContext = useContext(POSContext);
  return posContext;
};
