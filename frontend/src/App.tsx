import {RootNavigation} from './navigation/RootNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {baseTheme} from './theme/paperTheme';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {IOS_CLIENT_ID, WEB_CLIENT_ID} from '@env';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import {useStore} from './stores';

export default function App() {
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

  auth().onAuthStateChanged(async user => {
    setLoggedIn(!!user);
  });

  useEffect(() => {
    userStore.setIsLoggedIn(loggedIn);
    if (loggedIn) {
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

  return (
    <PaperProvider theme={baseTheme}>
      <ApolloProvider client={client}>
        <RootNavigation />
      </ApolloProvider>
    </PaperProvider>
  );
}
