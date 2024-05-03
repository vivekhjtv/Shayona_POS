import { createContext, useContext, useState } from 'react';
import axios from 'axios';
const POSContext = createContext({});

const POSContextWrapper = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

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
  const handlePlaceOrder = async () => {
    const postSelectedItemsToDataBase = async (selectedItems) => {
      try {
        await axios.post(`http://localhost:8000/api/items/`, {
          items: selectedItems,
        });
        // console.log('Items added successfully');
      } catch (error) {
        console.error('Error adding items:', error);
      }
    };
    await postSelectedItemsToDataBase(selectedItems);
    setSelectedItems([]);
  };

  const contextValue = {
    addItemToLeftList,
    selectedItems,
    setSelectedItems,
    handlePlaceOrder,
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
