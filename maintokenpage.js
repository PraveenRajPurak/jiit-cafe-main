import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, StyleSheet, Image, ScrollView } from 'react-native';
import { useSelectedItems } from './SelectedItemsContext.js';
import { useUser } from './userContext.js';
import OrderList from './orderList.js';
import { FlatList } from 'react-native';


const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const OrderBox = ({ order, currentTimestamp }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const calculateTotalCost = () => {
    // Calculate total cost by summing up the prices of individual items multiplied by their counts
    return order.items.reduce((total, item) => total + item.coinCount * item.count, 0);
  };

  useEffect(() => {
    // Calculate remaining time for pending orders
    if (order.status === 'pending') {
      const orderTimestamp = new Date(order.orderDate).getTime();
      const elapsedSeconds = Math.floor((currentTimestamp - orderTimestamp) / 1000);
      const remainingSeconds = Math.max(0, 900 - elapsedSeconds); // 15 minutes in seconds
      setRemainingTime(remainingSeconds);
    }
  }, [order, currentTimestamp]);


  return (
<TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
      <View style={styles.orderBox}>
        <Text style={styles.orderText}>{`Order ID: ${order.orderId}`}</Text>
        <Text style={styles.orderText}>{`Order Date: ${order.orderDate}`}</Text>
        {showDetails && (
          <>
            <Text style={styles.orderText}>{`Status: ${order.status}`}</Text>
            {order.status === 'pending' && (
              <Text style={styles.orderText}>{`Remaining Time: ${formatTime(remainingTime)}`}</Text>
            )}
            <Text style={styles.sectionHeader}>Items:</Text>
            {order.items.map((item, index) => (
              <Text key={index} style={styles.orderText}>{`${item.dishName} x ${item.count} - ${(item.coinCount * item.count)}`}</Text>
            ))}
            <Text style={styles.totalCostText}>{`Total Cost: ${calculateTotalCost()}`}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const MaintokenPage = ({ onClose }) => {
  const [showOrderId, setShowOrderId] = useState(false);
  const [timer, setTimer] = useState(900); // 15 minutes in seconds
  const [latestOrderTimestamp, setLatestOrderTimestamp] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const [pendingOrders, setPendingOrders] = useState([]);
  const { userData } = useUser();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (timer === 0) {
      fetchOrders();
      // Reset the timer for the next interval (15 minutes)
      setTimer(900);
    }
  }, [timer]);

  const fetchOrders = async () => {
    try {
      const { token } = userData;

      // Fetch all user orders
      const response = await fetch('http://192.168.177.64:3000/auth/alluserorders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('API Response:', response);

      if (response.ok) {
        const allOrders = await response.json();

        // Tag orders with status
        const ordersWithStatus = allOrders.map(order => {
          const status = determineStatus(order); // Implement determineStatus function
          return { ...order, status };
        });

        setOrders(ordersWithStatus);
      } else {
        // Handle error
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      // Handle network error
      console.error('Error fetching orders:', error);
    }
  };

  const determineStatus = (order) => {
    // Check if the order exists and has a status property
    if (order && order.status) {
      return order.status.toLowerCase(); // Assuming the status is a string like 'Pending', 'Failed', 'Successful'
    }
  
    return 'unknown'; // Set a default status if needed
  };
  
  

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const handleOrderIdToggle = () => {
    setShowOrderId(!showOrderId);
  };

  const { selectedItems } = useSelectedItems();

  // Calculate total cost
  const totalCost = selectedItems.reduce((acc, item) => acc + item.amount * item.cost, 0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardShouldPersistTaps="always"
      keyboardVerticalOffset={-500}
    >
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderBox order={item} currentTimestamp={new Date().getTime()} />}
          keyExtractor={(item) => item.orderId.toString()}
        />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MaintokenPage;
