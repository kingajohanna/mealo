import {Login} from '../screens/Login';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

enum AuthTabs {
  LOGIN = 'Login',
}

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthTabs.LOGIN}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={AuthTabs.LOGIN} component={Login} />
    </Stack.Navigator>
  );
};
