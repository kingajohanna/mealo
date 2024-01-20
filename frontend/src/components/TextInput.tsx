import { StyleProp, StyleSheet, TextInputProps, TextStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { TextInput as TextInputBase } from 'react-native';

type Props = {
  onChangeText: (text: string) => void;
  text: string;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
} & TextInputProps;

export const TextInput: React.FC<Props> = (props) => {
  return (
    <TextInputBase
      {...props}
      style={[styles.titleText, props.style]}
      placeholderTextColor={Colors.pine}
      onChangeText={props.onChangeText}
      value={props.text}
      placeholder={props.placeholder}
      editable={!props.disabled}
    />
  );
};

const styles = StyleSheet.create({
  titleText: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 8,
    marginBottom: 8,
    borderColor: Colors.pine,
    backgroundColor: Colors.beige,
  },
});
