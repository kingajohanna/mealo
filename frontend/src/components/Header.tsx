import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, ViewProps, StyleProp, TextStyle } from 'react-native';
import { Colors } from '../theme/colors';

type HeaderProps = {
  title: string;
  rightAction?: ReactNode;
  leftAction?: ReactNode;
} & ViewProps;

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <View style={styles.header}>
      <View style={{ width: 30 }}>{props.leftAction}</View>
      <Text adjustsFontSizeToFit={true} numberOfLines={2} style={styles.text}>
        {props.title}
      </Text>
      <View style={{ minWidth: 30, alignItems: 'center', justifyContent: 'center' }}>{props.rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.beige,
  },
  header: {
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: Colors.pine,
    width: '100%',
    height: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
    color: Colors.beige,
    alignSelf: 'center',
  },
});
