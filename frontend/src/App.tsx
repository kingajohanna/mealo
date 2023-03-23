import {RootNavigation} from './navigation/RootNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import React from 'react';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
