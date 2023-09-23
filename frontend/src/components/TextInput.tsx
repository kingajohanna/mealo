import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { TextInput as TextInputBase } from 'react-native';

type Props = {
  onChangeText: (text: string) => void;
  text: string;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
};

export const TextInput: React.FC<Props> = (props) => {
  return (
    <TextInputBase
      style={[styles.titleText, props.style]}
      placeholderTextColor={Colors.pine}
      onChangeText={props.onChangeText}
      value={props.text}
      placeholder={props.placeholder}
    />
  );
};

const styles = StyleSheet.create({
  titleText: {
    borderWidth: 2,
    padding: 10,

    borderRadius: 15,
    marginHorizontal: 8,
    borderColor: Colors.pine,
    backgroundColor: Colors.beige,
  },
});
