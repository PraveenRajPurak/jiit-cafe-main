// SelectedItemsContext.js
import React, { createContext, useContext, useState } from 'react';

const SelectedItemsContext = createContext();

const cardData = [
  { id: '1', key:'1', imageUrl: require('./jiitcafeassests/Indian-samosa-chutney.webp'), dishName: 'Samosa', coinCount: 10 },
  { id: '2', key:'2', imageUrl: require('./jiitcafeassests/pasta.png'), dishName: 'Pasta', coinCount: 20 },
  { id: '3', key:'3', imageUrl: require('./jiitcafeassests/patties.png'), dishName: 'Patty', coinCount: 10 },
  { id: '4', key:'4', imageUrl: require('./jiitcafeassests/noodles.png'), dishName: 'Noodles', coinCount: 20 },
  { id: '5', key:'5', imageUrl: require('./jiitcafeassests/burger.png'), dishName: 'Burger', coinCount: 30 },
  { id: '6', key:'6', imageUrl: require('./jiitcafeassests/hotdog.png'), dishName: 'Hotdog', coinCount: 20 },
  { id: '7', key:'7', imageUrl: require('./jiitcafeassests/coffee.png'), dishName: 'Coffee', coinCount: 10 },
  // Add more card data as needed
];

export function useSelectedItems() {
  return useContext(SelectedItemsContext);
}

export function SelectedItemsProvider({ children, onCartChange }) {
  
  const [selectedItems, setSelectedItems] = useState([]);

  const generateUniqueKey = () => {
    return `${Math.random().toString(36).substring(2, 9)}`;
  };

  const addOrUpdateItemInCart = (itemId) => {
    // Check if the item with the same id already exists in the cart
    const itemIndex = selectedItems.findIndex((item) => item.id === itemId);
  
    if (itemIndex !== -1) {
      // If the item exists, increment its count
      const updatedItems = [...selectedItems];
      updatedItems[itemIndex].count += 1;
      setSelectedItems(updatedItems);
    } else {
      // If the item doesn't exist, add it to the cart with a count of 1
      const newItem = { id: itemId, count: 1, key: generateUniqueKey() };
      console.log('Adding item to selectedItems:', newItem);
      setSelectedItems([...selectedItems, newItem]);
    }
  
    console.log('Selected Items after addOrUpdateItemInCart:', selectedItems);
  };
  
  
  const removeItemFromCart = (itemId) => {
    console.log('Removing item with id:', itemId);
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
  
      // Update the cardData array if needed
      cardData.forEach((item) => {
        const count = updatedItems.find((selectedItem) => selectedItem.id === item.id)?.count || 0;
        item.count = count;
      });
  
      console.log('Selected Items after removeItemFromCart:', updatedItems);
      return updatedItems;
    });
  };

  

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, cardData, setSelectedItems, addOrUpdateItemInCart, removeItemFromCart, useSelectedItems ,generateUniqueKey }}>
      {children}
    </SelectedItemsContext.Provider>
  );
}
