import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type Props = {
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title: string;
} & PressableProps;

export const Button: React.FC<Props> = (props) => {
  return (
    <Pressable
      style={[styles.buttonContainer, props.style, { opacity: props.disabled ? 0.5 : 1 }]}
      onPress={props.onPress}
    >
      {props.icon && <View style={[styles.iconContainer, props.iconStyle]}>{props.icon}</View>}
      <Text style={[styles.text, props.titleStyle]}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.beige,
    width: '80%',
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 20,
    alignItems: 'center',
    transform: [{ scaleX: -1 }],
  },
  text: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textDark,
  },
});
