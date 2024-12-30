import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Box, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, Flex, Button, AddIcon, MinusIcon, useColorModeValue  } from "native-base";
import { TabView, SceneMap } from 'react-native-tab-view';
import Constants from 'expo-constants';
import { useNavigation, useFocusEffect} from '@react-navigation/native';


const FirstRoute = () => <Center flex={1} my="4"></Center>;

const SecondRoute = () => <Center flex={1} my="4"></Center>;

const ThirdRoute = () => <Center flex={1} my="4"></Center>;

const FourthRoute = () => <Center flex={1} my="4"></Center>;

const CustomTabComponent = (route) => (
    <Box alignItems="center">
      <Image source={route.iconSource}  alt = '' style={{ width: 37, height: 37 }} />
    </Box>
  );
  

const initialLayout = {
  width: Dimensions.get('window').width
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  fourth: FourthRoute
});


 export function BottomTabUser({focussedIndex}) {
  const [index, setIndex] = React.useState(focussedIndex);
  const [routes] = React.useState([{
    key: 'first',
    title: 'Tab 1',
    iconSource: require('../jiitcafeassests/a-order.png'),
    navigTo: 'food',
  }, {
    key: 'second',
    title: 'Tab 2',
    iconSource: require('../jiitcafeassests/a-orders.png'),
    navigTo: 'ordersUser',
  }, {
    key: 'third',
    title: 'Tab 3',
    iconSource: require('../jiitcafeassests/u-wallet.png'),
    navigTo: 'wallet',
  }, {
    key: 'fourth',
    title: 'Tab 4',
    iconSource: require('../jiitcafeassests/cart.png'),
    navigTo: 'cart',
  }]);

  const renderTabBar = props => {
    const navigation = useNavigation();
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return <Box flexDirection="row" >
        {props.navigationState.routes.map((route, i) => {
        const opacity = props.position.interpolate({
          inputRange,
          outputRange: inputRange.map(inputIndex => inputIndex === i ? 1 : 0.5)
        });
        const color = index === i ? useColorModeValue('#000', '#e6e5e5') : useColorModeValue('#1f2937', '#a1a1aa');
        const borderColor = index === i ? 'cyan.500' : useColorModeValue('coolGray.200', 'gray.400');
        return <Box borderBottomWidth={3} borderColor={ borderColor} flex={1} alignItems="center" p="0" cursor="pointer" height={12} >
               < Pressable onPress={() => {
             console.log(i);
             navigation.navigate(route.navigTo);
          }} >
            <CustomTabComponent iconSource={route.iconSource}  />
            </Pressable>
            </Box>;
      })}
      </Box>;
  };

  return <TabView navigationState={{
    index,
    routes
  }} renderScene={renderScene} renderTabBar={renderTabBar} onIndexChange={setIndex} initialLayout={initialLayout} style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 49,
    backgroundColor: '#f5f5f5',
  }} 
  />;


}
