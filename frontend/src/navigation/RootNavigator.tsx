import {useStore} from '../stores';
import {AuthNavigator} from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import React, {useCallback, useEffect, useState} from 'react';
import {AppNavigator} from './AppNavigator';
import ShareMenu, {ShareCallback, ShareData} from 'react-native-share-menu';
import {urlCheck} from '../utils/regex';
import {Alert, Platform} from 'react-native';
import {addRecipe} from '../api/backend';
import RNBootSplash from 'react-native-bootsplash';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {IOS_CLIENT_ID, WEB_CLIENT_ID} from '@env';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import auth from '@react-native-firebase/auth';

export const RootNavigation = () => {
  const {userStore, recipeStore} = useStore();
  const [loggedIn, setLoggedIn] = useState(false);
  const [client, setClient] = useState<ApolloClient<any>>(
    new ApolloClient({
      uri: 'http://127.0.0.1:4000/graphql',
      cache: new InMemoryCache(),
    }),
  );

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  firebase.auth().onAuthStateChanged(async user => {
    setLoggedIn(!!user);
  });

  useEffect(() => {
    userStore.setIsLoggedIn(loggedIn);
    if (loggedIn) {
      recipeStore.setRecipes();
      auth()
        .currentUser?.getIdToken(true)
        .then(token => {
          setClient(
            new ApolloClient({
              uri: 'http://127.0.0.1:4000/graphql',
              headers: {
                Authorization: token ? token : '',
              },
              cache: new InMemoryCache(),
            }),
          );
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, []);

  const handleShare: ShareCallback = useCallback((share?: ShareData) => {
    if (!share) {
      return;
    }

    const {data} = share;

    const url = Array.isArray(data) ? data[0] : data;

    if (url.match(urlCheck) && Platform.OS === 'ios') {
      recipeStore.addRecipe(url);
    } else {
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

  return (
    <NavigationContainer onReady={() => RNBootSplash.hide()}>
      <ApolloProvider client={client}>
        {loggedIn ? <AppNavigator /> : <AuthNavigator />}
      </ApolloProvider>
    </NavigationContainer>
  );
};
