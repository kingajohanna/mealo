import { StyleProp, View, ViewStyle } from 'react-native';
import { Button } from './Button';
import { Colors } from '../theme/colors';

type Props = {
  disabled?: boolean;
  backTitle?: string;
  nextTitle?: string;
  back: () => void;
  next: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export const BottomButtons: React.FC<Props> = (props) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        },
        props.containerStyle,
      ]}
    >
      <Button
        onPress={props.back}
        title={props.backTitle ? props.backTitle : 'Back'}
        style={[
          { backgroundColor: Colors.beige, width: '45%', borderColor: Colors.salmon, borderWidth: 2 },
          props.buttonStyle,
        ]}
        titleStyle={{ textAlign: 'center', color: Colors.salmon }}
      />
      <Button
        onPress={props.next}
        title={props.nextTitle ? props.nextTitle : 'Next'}
        disabled={props.disabled}
        style={[{ backgroundColor: Colors.salmon, width: '45%' }, props.buttonStyle]}
        titleStyle={{ textAlign: 'center' }}
      />
    </View>
  );
};
