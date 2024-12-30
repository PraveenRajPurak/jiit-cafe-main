//cart.js
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, Flex } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Cards } from './components/cards.js';
import { Dimensions } from 'react-native';
import { NativeBaseProvider, Box, Center } from "native-base";
import { FlatList } from 'react-native';
import { BottomTabUser } from './components/bottomTabUser.js';
import { useSelectedItems } from './SelectedItemsContext.js';
import { SwipeRow } from 'native-base';
import SwipeValueBasedUi from './components/swipeList.js';
import { useUser } from './userContext';
import { fetchUserDetails } from './fetchApi.js';
import OrderPopup from './orderPopup.js';

export default function Cart({ navigation }) {
  const screenWidth = Dimensions.get('window').width;
  const screenLength = Dimensions.get('window').height;

  const [isOrderPlacedPopupVisible, setOrderPlacedPopupVisible] = useState(false);


  const { userData } = useUser() || {};
  const { token } = userData || {}; // Destructuring token from userData because it contains updateUser and userData so we need to destructure it since the token is nested inside the userData


  const { selectedItems, removeItemFromCart, cardData } = useSelectedItems();

  // State to store user details
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details when the component mounts
  const fetchUserData = async (userData) => {
    const userDetailsData = await fetchUserDetails(userData);
    setUserDetails(userDetailsData);
  };

  useEffect(() => {
    fetchUserData(userData);
  }, []);

  const handlePlaceOrder = async () => {
    console.log("Placing Order...");
    console.log(selectedItems);

    const { token } = userData;

    try {
      const response = await fetch('http://192.168.177.64:3000/auth/placeorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          selectedItems,
        }),
      });

      console.log('API Response:', response);
      console.log(userData);

      // After successfully placing the order, navigate to 'ordersUser'
      setOrderPlacedPopupVisible(true);

      setTimeout(() => {
        setOrderPlacedPopupVisible(false);
        navigation.navigate('ordersUser', { showTokenPopup: true });
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (e.g., show a message to the user)
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='height'
      keyboardShouldPersistTaps='always' // This should handle taps outside TextInput
      keyboardVerticalOffset={-500}
    >
      {isOrderPlacedPopupVisible && (
        <OrderPopup isVisible={isOrderPlacedPopupVisible} onClose={() => setOrderPlacedPopupVisible(false)} />
      )}
      <SafeAreaView style={styles.container} keyboardShouldPersistTaps='always'>
        <SafeAreaView style={styles.curvedLine} />

        <Image
          source={require('./imgs/jcafelogo1-removebg-preview.png')}
          style={{ width: 60, height: 60, position: 'absolute', top: 60, left: 30 }} // Adjust the dimensions as needed
        />

        <Text style={{ fontSize: 19, fontWeight: 'bold', position: 'absolute', textAlign: 'left', left: 100, top: 75, color: 'black' }}>
          JIIT CAFE</Text>

        <View style={[styles.fields, { position: 'absolute', top: 60, right: 85, width: 100, height: 50, backgroundColor: 'white', borderColor: 'black', borderWidth: 1, flexDirection: 'row' }]} overflow='hidden' >
          <Image
            source={require('./jiitcafeassests/jcoins.png')}
            style={{ width: 33, height: 33, }} // Adjust the dimensions as needed
          />
          {userDetails ? (
            <Text style={{ fontSize: 20, }}>{userDetails.jCoins}</Text>
          ) : (
            <Text>0</Text>
          )}
        </View>

        <Image
          source={require('./jiitcafeassests/account.png')}
          style={{ width: 45, height: 45, position: 'absolute', top: 60, right: 25 }} // Adjust the dimensions as needed
        />

        {
          selectedItems.length === 0 ? (
            <View>
              <Center>
                <Image
                  source={require('./jiitcafeassests/nofood.png')}
                  style={{ width: 300, height: 200, position: 'absolute', top: 150, right: 10 }}
                />
                <Text style={{ fontSize: 20, fontWeight: '600', top: 380 }}> No items Found </Text>
                <Text style={{ fontSize: 16, fontWeight: '300', padding: 10, textAlign: 'center', top: 380 }}>
                  Add items in your cart from the menu
                </Text>
              </Center>
            </View>
          ) : (
            <View style={{ top: 150, height: screenLength - 40, }}>
              {/* Content for when selectedItems.length is not 0 */}
              {selectedItems.length > 0 && (
                <>
                  <SwipeValueBasedUi />
                  <View style={styles.placeOrderButton}>
                    <TouchableOpacity onPress={handlePlaceOrder}>
                      <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>
                        Place Order
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )
        }


        <StatusBar style="auto" />

      </SafeAreaView>

      <NativeBaseProvider>
        <BottomTabUser focussedIndex={3} />
      </NativeBaseProvider>

    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },


  curvedLine: {
    position: 'absolute',
    top: 50,
    width: '89%',
    height: '3%',
    borderTopWidth: 2.5,
    borderRightWidth: 0.1,
    borderLeftWidth: 0.1,
    borderRadius: 20,
    borderTopColor: 'black',
    borderRightColor: 'white',
    borderLeftColor: 'white',
  },


  roundedBox: {
    position: 'absolute', // Change the position to absolute
    bottom: 230,
    width: 350, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    backgroundColor: 'aqua', // Background color of the box
    borderRadius: 30, // Adjust the borderRadius to control the roundness
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },

  fields: {
    position: 'absolute', // Change the position to absolute
    bottom: 380,
    right: 30,
    width: 250, // Adjust the width as needed
    height: 40, // Adjust the height as needed
    backgroundColor: 'black', // Background color of the box
    borderRadius: 30, // Adjust the borderRadius to control the roundness
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },

  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },

  cartItem: {

    flexDirection: 'row', // Items will be displayed in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'flex-start', // Distribute items evenly
    marginVertical: 5, // Adjust the vertical margin as needed
    padding: 10, // Add padding for spacing and visual appeal
    backgroundColor: 'white', // Background color of the cart item
    borderRadius: 10, // Add border radius for rounded corners
  },


  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },


  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  placeOrderButton: {
    position: 'absolute',
    bottom: 170,
    right: 75,
    width: 250,
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },


});
