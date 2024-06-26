import { createContext, useContext, useState } from 'react';
import axios from 'axios';
const POSContext = createContext({});

const POSContextWrapper = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState('');

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
    if (selectedItems.length === 0) {
      alert('Please Select Items');
      return;
    }

    if (!name) {
      alert('Please Enter Customer Name');
      return;
    }
    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };

    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);

    const postSelectedItemsToDataBase = async (items) => {
      try {
        // await axios.post(`http://localhost:8000/api/items`, {
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
  };

  const contextValue = {
    addItemToLeftList,
    selectedItems,
    setSelectedItems,
    handlePlaceOrder,
    customerName,
    setCustomerName,
  };

  return (
    <POSContext.Provider value={contextValue}>{children}</POSContext.Provider>
  );
};

export default POSContextWrapper;

export const usePOSContext = () => {
  const posContext = useContext(POSContext);
  return posContext;
};
