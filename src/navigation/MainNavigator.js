import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; // Quita las llaves `{ }`

const Tab = createBottomTabNavigator();

const MainNavigator = () => (
  <Tab.Navigator initialRouteName="Home">
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
);

export default MainNavigator;
