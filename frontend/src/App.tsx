import { RootNavigation } from './navigation/RootNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import React from 'react';
import { baseTheme } from './theme/paperTheme';
import { ApolloClient, ApolloProvider, InMemoryCache, from } from '@apollo/client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { BACKEND_URL, IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';
import auth from '@react-native-firebase/auth';
import { useStore } from './stores';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './locales/config';
import { LogBox } from 'react-native';
import { createCalendar } from './nativeModules/ReminderModule';
import { PERMISSIONS, request } from 'react-native-permissions';

LogBox.ignoreLogs([
  'An error occurred! For more details, see the full error text at https://go.apollo.dev/c/err#%7B%22version%22%3A%223.8.3%22%2C%22message%22%3A12%2C%22args%22%3A%5B%5D%7D',
]);

export default function App() {
  const { userStore } = useStore();

  request(PERMISSIONS.IOS.CALENDARS).then(() => {
    request(PERMISSIONS.IOS.CALENDARS_WRITE_ONLY).then(() => {
      request(PERMISSIONS.IOS.REMINDERS).then(() => {
        createCalendar();
      });
    });
  });

  const httpLink = createUploadLink({
    uri: BACKEND_URL,
  });

  const asyncAuthLink = setContext(
    () =>
      new Promise(async (success) => {
        await auth()
          .currentUser?.getIdToken()
          .then((token) => {
            console.log(token);

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
