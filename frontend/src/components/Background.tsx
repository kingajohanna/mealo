import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ViewProps,
  StatusBar,
} from 'react-native';
import {Colors} from '../theme/colors';

export const ScreenBackground: React.FC<ViewProps> = props => {
  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.children}>{props.children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.pine,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flex: 1,
  },
  children: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.beige,
    paddingTop: 45,
    paddingBottom: 50,
  },
});
