import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Signup () {

  function truncateText(text, maxLength) {
       if (text.length > maxLength) {
          return text.substring(0, maxLength) ;
        }
        return text;
    }

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const nameSet = (newText) => {
    newText = truncateText(newText, 50);
    setName(newText);
  };

  const enrollmentNoSet = (newText) => {
    newText = truncateText(newText, 10);
    setEnrollmentNo(newText);
  };

  const passwordSet = (newText) => {
    newText = truncateText(newText, 20);
    setPassword(newText);
  };

  const passwordConfirm = (newText) => {
    newText = truncateText(newText, 20);
    setConfirmPassword(newText);
  };


  const handleSignUp = async () => {
    try {
      const response = await fetch('http://192.168.177.64:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          enrollmentNo,
          password,
        }),
      });
  
      const data = await response.json();
      console.log(data); // Log the response from the server
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
  

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior='height'
    keyboardShouldPersistTaps='always' // This should handle taps outside TextInput
    keyboardVerticalOffset={-500}
    >
    
    <SafeAreaView style={styles.container} keyboardShouldPersistTaps='always'>
    <SafeAreaView style={styles.curvedLine}/>
    <Image
        source={require('./imgs/jcafelogo1-removebg-preview.png')} 
        style={{ width: 70, height: 70, position:'absolute', top: 60, left: 40 }} // Adjust the dimensions as needed
    />
    
      <Text style={{fontSize: 25, fontWeight: 'bold',position:'absolute', textAlign: 'left', left:125 ,top:75, color: 'black'}}>
        JIIT CAFE</Text>

       <View style={styles.roundedBox} keyboardShouldPersistTaps='always'>

            <Image
                source={require('./icons/boy.png')} 
                style={{ width: 40, height: 40, position:'absolute', top: 60, left: 15 }} // Adjust the dimensions as needed
            />
            <View style={[styles.fields, {bottom:380, right: 30,} ]} overflow='hidden' >
              <TextInput style={{color: 'white', right: 50, left: -45, }}
                         numberOfLines={1}
                         keyboardType="default" // Specify the keyboard type here 
                         placeholder='Enter your Name' 
                         placeholderTextColor= 'white' 
                         onChangeText={nameSet} 
                         value={name} />
            </View>

            <Image
                source={require('./icons/id-card.png')} 
                style={{ width: 40, height: 40, position:'absolute', top: 145, left: 15 }} // Adjust the dimensions as needed
            /> 
            <View style={[styles.fields, {bottom:300, right: 30,}]} overflow='hidden' >
              <TextInput style={{color: 'white', right: 50, }}
                         keyboardType="numeric" // Specify the keyboard type here 
                         placeholder='Enrollment No.' 
                         placeholderTextColor= 'white' 
                         onChangeText={enrollmentNoSet} 
                         value={enrollmentNo} />
            </View>

            <Image
                source={require('./icons/security.png')} 
                style={{ width: 40, height:40, position:'absolute', top: 220, left: 15 }} // Adjust the dimensions as needed
            /> 
            <View style={[styles.fields, {bottom:220, right: 30,}]} overflow='hidden' >
              <TextInput style={{color: 'white', right: 55, }}
                         secureTextEntry={true} 
                         placeholder='Set Password'
                         placeholderTextColor= 'white'
                         onChangeText={passwordSet} 
                         value={password} />
            </View>

            <Image
                source={require('./icons/password.png')} 
                style={{ width:70, height:70, position:'absolute', top: 285, left: 6 }} // Adjust the dimensions as needed
            /> 
            <View style={[styles.fields, {bottom:140, right: 30,}]} overflow='hidden' >
              <TextInput style={{color: 'white', right: 40, }}
                         secureTextEntry={true}
                         placeholder='Confirm Password' 
                         placeholderTextColor= 'white' 
                         onChangeText={passwordConfirm} 
                         value={confirmPassword}/>
            </View>

            
                <TouchableOpacity 
                       style={[styles.roundedBox, 
                       {width: 200, height:60, backgroundColor:'black',bottom:40}]} 
                       onPress={handleSignUp}>
                    
                <Text style={{color: 'white', alignItems:'center', fontSize: 20 }} >Sign up</Text>

                </TouchableOpacity>

            <Image
                 source={require('./icons/profile.png')} 
                 style={{ width: 80, height: 80, position:'absolute', top: -40, left: 135 }} // Adjust the dimensions as needed
            /> 

            <Text style={{position:'absolute', bottom : -30}}>
                 Already have an account? <Text style={{color: 'blue',}} onPress={() => navigation.navigate('login')}>Sign in</Text>
            </Text>

        </View>
    <StatusBar style="auto" />

    </SafeAreaView></KeyboardAvoidingView>
    
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
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
      bottom: 150,
      width: 350, // Adjust the width as needed
      height: 480, // Adjust the height as needed
      backgroundColor: 'lightblue', // Background color of the box
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
    borderRadius: 10, // Adjust the borderRadius to control the roundness
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


});