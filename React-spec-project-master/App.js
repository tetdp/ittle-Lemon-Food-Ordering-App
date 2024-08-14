import { StatusBar } from 'expo-status-bar';
import { StyleSheet,
   Text,
    View
   } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
//=======importing components here=========
import OnBoarding from './screens/OnBoarding';
import Profile from './screens/Profile';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from "./screens/Home";
//=========================================
const Stack = createNativeStackNavigator();

export default function App() {

  //hooks

  const [onBoardingComplete, setOnBoardingComplete] = useState(false);



  //render conditional
  useEffect(() =>{
    (async () => {
      try{
        const loadedCondition = await AsyncStorage.getItem("isOnboardingCompleted");
        setOnBoardingComplete(loadedCondition === null? false:true)
      }catch(err){
        console.log(err)
      }
    }

    )();
  }, [])//no dependancy



  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {onBoardingComplete ? 
        (<>
                <Stack.Screen name="welcome" component={OnBoarding}/>
                <Stack.Screen name = "home" component={Home} />
                <Stack.Screen name="user Profile" component={Profile} />
                
        </>)
        :
        (<>

        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="user Profile" component={Profile} />
        <Stack.Screen name="welcome" component={OnBoarding}/>
        
        </>)
        
        }

      </Stack.Navigator>
    </NavigationContainer>
    // <OnBoarding/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
