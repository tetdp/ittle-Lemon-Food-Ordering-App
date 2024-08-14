import React, { useState, useEffect, useContext } from "react";
import {Text, View,TextInput, StyleSheet,Image,Pressable, KeyboardAvoidingView} from 'react-native'
import { validateEmail, validateName } from "../utils/validate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from '@react-navigation/native'
import {AppContext } from "../context/AppContext";

export default function OnBoarding() {

    //hooks area:
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [isButtonOn, setIsButtonOn] = useState(false);
    //getting our save profile function from context

    const navigate = useNavigation();
    //validation area
    
    
    useEffect(() => {
        const isEmailValid = validateEmail(email);
        const isNameValid = validateName(name)

        if (!isEmailValid && !isNameValid)
             {setIsButtonOn(true)}
        else {setIsButtonOn(false)};
      }, [email, name]);

      

    //saving user info area
    const handleSubscribeRequest = () => {
        try {
          let userData = {
            firstName: name,
            lastName: "",
            mail: email,
            phone: "",
            imagePath: "",
          };
          AsyncStorage.setItem("userData", JSON.stringify(userData));
          AsyncStorage.setItem("isOnboardingCompleted", "true");
          let preferences = {
            orderStatus: true,
            passwordChanges: true,
            specialOffers: true,
            newsletter: true,
          };
          AsyncStorage.setItem("preferences", JSON.stringify(preferences));
          alert("thanks for signing in")
          let wentToNewTab = false;
          setInterval(() => {
            if (!wentToNewTab) {
              navigate.push("user Profile");
              wentToNewTab = true;
            }
          }, 1000);
        } catch (err) {
          alert("error, unable to sign in")
        }
      };



    //render area
    return(
        
    <View style={{flex: 1}}>
        
        <View style={styler.headerContainer}>
            <Image source={require("../assets/Logo.png")}/>
           
        </View>


        <View style={styler.bodyContainer}>
            <Text>Let us get to know you</Text>

            <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder={"type your email"}
            style={styler.input}
            />

            <TextInput
            value={name}
            onChangeText={setName}
            keyboardType="default"
            placeholder={"type your name!"}
            style={styler.input}
            />



        </View>

        {/**
         * bug: one true value lets it enable
         */}
        <View style={styler.footerContainer}>
            <Pressable 
            onPress={handleSubscribeRequest }
            style = {[styler.buttonWrapper, isButtonOn && styler.buttonDisabled]}
            // style={[styler.buttonWrapper, !isEmailValid&&!isNameValid && styler.buttonDisabled]}
            disabled={isButtonOn}
            >
                <Text>Next</Text>
            </Pressable>
        
        </View>

    </View>
);}




//=======styles=========

const styler = StyleSheet.create({
    imageStyle:{
        height: 150,
        width: 200,
        margin:30,
    },
    input: {
        height: 40,
        marginVertical: 24,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: "EDEFEE",
      },
    headerContainer: {
        flex:0.15,
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:"#dce1e7",
    },
    bodyContainer:{
        backgroundColor:"#c9ced7",
        flex:0.7,
        alignItems:"center",
        justifyContent: "center",

    },
    footerContainer:{
        flex:0.15,
        flex:0.15,
        alignItems:"center",
        justifyContent:"space-evenly",
        backgroundColor:"#dce1e7",
    },
    buttonWrapper: {
        borderRadius: 8,
        backgroundColor: '#495E57',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
      },
      buttonDisabled: {
        borderRadius: 8,
        backgroundColor: 'grey',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
        opacity: 25,
      },
    

    

})