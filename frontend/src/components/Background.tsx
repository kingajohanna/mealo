import React from 'react';
import { StyleSheet, View, SafeAreaView, ViewProps, StatusBar } from 'react-native';
import { Colors } from '../theme/colors';
import { isAndroid } from '../utils/androidHelper';

type Props = {
  fullscreen?: boolean;
  notificationBarColor?: string;
  darkStatusBarContent?: boolean;
  beigeStatusBar?: boolean;
} & ViewProps;

export const ScreenBackground: React.FC<Props> = (props) => {
  return (
    <>
      <SafeAreaView
        testID="background"
        style={[
          styles.background,
          { backgroundColor: props.notificationBarColor ? props.notificationBarColor : Colors.pine },
        ]}
      />
      <StatusBar
        barStyle={props.darkStatusBarContent ? 'dark-content' : 'light-content'}
        backgroundColor={props.beigeStatusBar ? Colors.beige : Colors.pine}
      />

      <SafeAreaView
        testID="fullscreen-background"
        style={{
          backgroundColor: props.fullscreen ? Colors.beige : Colors.pine,
          flex: 1,
        }}
      >
        <View style={[styles.children, { paddingBottom: props.fullscreen ? 16 : 50 }, props.style]}>
          {props.children}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 0,
  },
  children: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.beige,
    paddingTop: 40,
  },
});
