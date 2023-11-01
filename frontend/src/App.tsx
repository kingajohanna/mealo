import { RootNavigation } from './navigation/RootNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import React from 'react';
import { baseTheme } from './theme/paperTheme';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { BACKEND_URL, IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';
import auth from '@react-native-firebase/auth';
import { useStore } from './stores';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const { userStore } = useStore();

  const httpLink = createUploadLink({
    uri: BACKEND_URL,
  });

  const asyncAuthLink = setContext(
    () =>
      new Promise(async (success) => {
        await auth()
          .currentUser?.getIdToken()
          .then((token) => {
            success({
              headers: {
                'Apollo-Require-Preflight': 'true',
                authorization: token,
              },
            });
          });
      }),
  );

  const client = new ApolloClient({
    link: from([asyncAuthLink, httpLink]),
    cache: new InMemoryCache(),
  });

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  auth().onAuthStateChanged(async (user) => {
    userStore.setIsLoggedIn(!!user);
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={baseTheme}>
        <ApolloProvider client={client}>
          <RootNavigation />
        </ApolloProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
