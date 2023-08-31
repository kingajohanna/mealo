import {Login} from '../screens/Login';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {AuthTabs} from './tabs';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthTabs.LOGIN}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={AuthTabs.LOGIN} component={Login} />
    </Stack.Navigator>
  );
};
