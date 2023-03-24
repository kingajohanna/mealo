import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ViewProps,
  StatusBar,
} from 'react-native';
import {Colors} from '../theme/colors';

type ScreenBackgroundProps = {
  title: string;
  withoutHeader?: boolean;
} & ViewProps;

export const ScreenBackground: React.FC<ScreenBackgroundProps> = props => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.gainsboro,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        flex: 1,
      }}>
      <StatusBar backgroundColor={Colors.gainsboro} barStyle="dark-content" />
      <View style={styles.background}>
        {!props.withoutHeader && (
          <View style={styles.header}>
            <Text style={styles.text}>{props.title}</Text>
          </View>
        )}
        {props.children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.gainsboro,
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: Colors.gainsboro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: Colors.teal,
  },
});
