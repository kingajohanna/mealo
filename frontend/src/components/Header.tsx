import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';
import { Colors } from '../theme/colors';

type HeaderProps = {
  title: string;
  rightAction?: ReactNode;
  leftAction?: ReactNode;
} & ViewProps;

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <View style={styles.header}>
      {props.leftAction}
      <Text adjustsFontSizeToFit={true} numberOfLines={2} style={styles.text}>
        {props.title}
      </Text>
      {props.rightAction}
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
    borderWidth: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderColor: 'transparent',
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
