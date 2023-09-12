import {RootNavigation} from './navigation/RootNavigator';
import {Provider as PaperProvider} from 'react-native-paper';
import React from 'react';
import {baseTheme} from './theme/paperTheme';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {IOS_CLIENT_ID, WEB_CLIENT_ID} from '@env';

export default function App() {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  return (
    <PaperProvider theme={baseTheme}>
      <RootNavigation />
    </PaperProvider>
  );
}
