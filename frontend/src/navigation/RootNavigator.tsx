import {useStore} from '../stores';
import {AuthNavigator} from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {AppNavigator} from './AppNavigator';

export const RootNavigation = () => {
  const {userStore, recipeStore} = useStore();

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

  useEffect(() => {
    if (loggedIn) {
      recipeStore.setRecipes();
    }
  }, [loggedIn]);

  return (
    <NavigationContainer>
      {userStore.isLoggedIn ? <AuthNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
};
