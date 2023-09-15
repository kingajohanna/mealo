import {RootNavigation} from './navigation/RootNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {baseTheme} from './theme/paperTheme';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {BACKEND_URL, IOS_CLIENT_ID, WEB_CLIENT_ID} from '@env';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import {useStore} from './stores';
import {storage} from './stores/localStorage';
import {useMMKVString} from 'react-native-mmkv';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';

export default function App() {
  const {userStore, recipeStore} = useStore();
  const [token, setToken] = useMMKVString('token');
  const [loggedIn, setLoggedIn] = useState(false);

  const httpLink = createHttpLink({
    uri: BACKEND_URL,
  });

  const authLink = setContext((_, {headers}) => {
    return {
      headers: {
        ...headers,
        authorization: token || '',
      },
    };
  });

  const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({message}) => {
        console.log(message);
      });
    }

    if (networkError) {
      console.log(networkError.message);
    }
  });

  const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache(),
  });

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  auth().onAuthStateChanged(async user => {
    setLoggedIn(!!user);
    if (!user) setToken('');
  });

  useEffect(() => {
    userStore.setIsLoggedIn(loggedIn);
    if (loggedIn) {
      auth()
        .currentUser?.getIdToken(true)
        .then(token => {
          setToken(token);
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
