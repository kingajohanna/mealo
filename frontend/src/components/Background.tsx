import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ViewProps,
  StatusBar,
} from 'react-native';
import {Colors} from '../theme/colors';

type Props = {
  fullscreen?: boolean;
} & ViewProps;

export const ScreenBackground: React.FC<Props> = props => {
  return (
    <>
      <SafeAreaView style={styles.background} />
      <StatusBar barStyle="dark-content" />

      <SafeAreaView
        style={{
          backgroundColor: props.fullscreen ? Colors.beige : Colors.pine,
          flex: 1,
        }}>
        <View
          style={[
            styles.children,
            {paddingBottom: props.fullscreen ? 16 : 50},
            props.style,
          ]}>
          {props.children}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 0,
    backgroundColor: Colors.pine,
  },
  children: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.beige,
    paddingTop: 40,
  },
});
