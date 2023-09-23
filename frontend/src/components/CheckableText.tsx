import React from 'react';
import { useState } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

type Props = {
  checkedStyle: StyleProp<TextStyle>;
  uncheckedStyle?: StyleProp<TextStyle>;
  addChecked?: (checked: boolean) => void;
} & TextProps;

export const CheckableText: React.FC<Props> = (props) => {
  const [checked, setChecked] = useState(false);

  return (
    <Text
      style={[props.style, checked ? props.checkedStyle : props.uncheckedStyle]}
      onPress={() => {
        setChecked(!checked);
        props.addChecked && props.addChecked(!checked);
      }}
    >
      {props.children}
    </Text>
  );
};
