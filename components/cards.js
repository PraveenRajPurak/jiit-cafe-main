//cards.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, Flex, Button, AddIcon, MinusIcon } from "native-base";
import { useSelectedItems } from '../SelectedItemsContext.js';

export function Cards ({ imageUrl, dishName, coinCount, id, onCountChange }) {
    

    // fetching the initial count from the global state
    const { selectedItems } = useSelectedItems();
    const cardData = useSelectedItems();
    const initialCount = selectedItems.find((item) => item.id === id)?.count || 0;
    const [isAvailable, setIsAvailable] = useState();

    const [count, setCount] = useState(0);
    const prevCount = count;

    const handleIncrement = () => {
      //if(isAvailable){}
      const newCount = count + 1;
      setCount(newCount);
      onCountChange(id, newCount, prevCount);
    };
    

    const handleDecrement = () => {
      //if(isAvailable){}
      if (count > 0) {
        const newCount = count - 1;
        setCount(newCount);
        onCountChange(id, newCount, prevCount);
      }
    };

    /*const checkItemAvailability = async () => {
      try {
        const response = await fetch('http://192.168.1.104:3000/user/checkItemAvailability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
  
        const data = await response.json();
        console.log('Availability data:', data);
        setIsAvailable(data.isAvailable);
      } catch (error) {
        console.error('Error checking availability:', error);
        setIsAvailable(false);
      }
    };

    useEffect(() => {
      checkItemAvailability();
    }, [id]);*/

    
  return < Box alignItems = "center" w = {'100%'} >
    <Box width = "100%"  maxWidth = {330} mx = {16} my = {8}>
      <Box
        borderWidth={1}
        borderColor="coolGray.200"
        bg="white"
        rounded="lg"
        overflow="hidden"
        shadow={2}
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        //opacity={isAvailable ? 1 : 0.5} // Adjust the opacity based on availability
      >
        <AspectRatio ratio={4/3}>
          <Image source={ imageUrl } alt={dishName} resizeMode="cover" w={'100%'} h={'100%'} />
        </AspectRatio>
        <Stack direction="row" alignItems="center" bg="tertiary.400" p={1} spaceX={2} bottom='4' >
        <HStack>
        <Flex bg="tertiary.400" p={1} spaceX={2} alignItems="flex-start" direction="row" >
          <Box flex={2}>
          <Text color="warmGray.50" fontWeight="bold" fontSize="lg">
            {dishName}
          </Text></Box>
          <Text color="white" fontWeight="semibold" fontSize="lg" >
            {coinCount}
          </Text>
          <Image source={require("japp/jiitcafeassests/jcoins.png")} alt="jcoin" w={8} h={8} />
        </Flex>
        </HStack></Stack>
        <HStack justifyContent="center" mt={0} mx={0} space={4} paddingBottom={3} >
          <Button
            size="sm"
            variant="outline"
            colorScheme="teal"
            onPress={handleDecrement}
          >
            <MinusIcon />
          </Button>
          <Text fontSize="lg">{initialCount}</Text>
          <Button
            size="sm"
            variant="outline"
            colorScheme="teal"
            onPress={() => {handleIncrement()}}

          >
            <AddIcon />
          </Button>
        </HStack>
      </Box>
    </Box>
    </Box>;
  
};

