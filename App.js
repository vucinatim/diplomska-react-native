import React, { Component } from 'react';
import firebase from 'firebase'
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGE_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
} from '@env'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MyTheme } from './ui/utils/Theme';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignUpScreen from './ui/components/login/SignUp'
import LoginScreen from './ui/components/login/Login'
import MainScreen from './ui/components/home/Main'
import ScanScreen from './ui/components/scanner/Scanner'
import MenuScreen from './ui/components/restaurant/Menu'
import SearchMenuScreen from './ui/components/restaurant/SearchMenu';
import RestaurantDetailsScreen from './ui/components/restaurant/RestaurantDetails';

const Stack = createStackNavigator();

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Scanner" component={ScanScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SearchMenu" component={SearchMenuScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
