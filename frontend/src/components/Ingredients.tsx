import React from 'react';
import {useState} from 'react';
import {Text, TextProps} from 'react-native';

export const Ingredients: React.FC<TextProps> = props => {
  const [checked, setChecked] = useState(false);

  return (
    <Text
      style={[
        props.style,
        {
          textDecorationLine: checked ? 'line-through' : 'none',
          textDecorationStyle: 'solid',
        },
      ]}
      onPress={() => setChecked(!checked)}>
      {props.children}
    </Text>
  );
};
