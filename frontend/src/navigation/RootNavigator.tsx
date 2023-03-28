import {useStore} from '../stores';
import {AuthNavigator} from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import React, {useCallback, useEffect, useState} from 'react';
import {AppNavigator} from './AppNavigator';
import ShareMenu, {ShareCallback, ShareData} from 'react-native-share-menu';
import {urlCheck} from '../utils/regex';
import {Alert, Platform} from 'react-native';
import {addRecipe} from '../contants/backend';

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

  const handleShare: ShareCallback = useCallback((share?: ShareData) => {
    if (!share) {
      return;
    }

    const {data} = share;

    const url = Array.isArray(data) ? data[0] : data;

    if (url.match(urlCheck) && Platform.OS === 'ios')
      recipeStore.addRecipe(url);
    else {
      Alert.alert(
        'Add recipe',
        'Do you want to add this recipe to your collection?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              addRecipe(url).then(() => recipeStore.setRecipes());
            },
          },
        ],
      );
    }
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
