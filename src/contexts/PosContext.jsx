import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const POSContext = createContext({});

const POSContextWrapper = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [notification, setNotification] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('admin_authenticated') === 'true'
  );

  const login = (username, password) => {
    // Basic admin credential check
    const correctUsername = process.env.REACT_APP_ADMIN_USERNAME;
    const correctPassword = process.env.REACT_APP_ADMIN_PASS;
    if (username.trim() === correctUsername && password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

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
      if (customerField) {
        customerField.style.border = '2px solid red'; // Highlight the field with red border
      }
      return;
    }

    // Reset border to original when customer name is provided
    if (customerField) {
      customerField.style.border = '1px solid #ccc'; // Reset to the original border
    }

    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };
    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);

    const postSelectedItemsToDataBase = async (items) => {
      const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
      try {
        await axios.post(`${BASE_URL}/api/items`, {
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



  const contextValue = {
    addItemToLeftList,
    selectedItems,
    setSelectedItems,
    handlePlaceOrder,
    customerName,
    setCustomerName,
    notification, // Add notification to context
    isAuthenticated,
    login,
    logout,
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
