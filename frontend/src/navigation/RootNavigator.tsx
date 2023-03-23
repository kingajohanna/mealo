import {useStore} from '../stores';
import {AuthNavigator} from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';

export const RootNavigation = () => {
  const {userStore} = useStore();

  const [loggedIn, setLoggedIn] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  useEffect(() => {
    if (loggedIn) userStore.setIsLoggedIn(true);
    else userStore.setIsLoggedIn(false);
  }, [loggedIn]);

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};
