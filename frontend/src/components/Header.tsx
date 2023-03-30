import React, {ReactNode} from 'react';
import {StyleSheet, View, Text, ViewProps} from 'react-native';
import {Colors} from '../theme/colors';

type HeaderProps = {
  title: string;
  menu?: ReactNode;
  back?: ReactNode;
} & ViewProps;

export const Header: React.FC<HeaderProps> = props => {
  return (
    <View style={styles.header}>
      {props.back}
      <Text style={styles.text}>{props.title}</Text>
      {props.menu}
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
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.beige,
    paddingHorizontal: '5%',
  },
});
