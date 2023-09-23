import { View } from 'react-native';
import { Button } from './Button';
import { Colors } from '../theme/colors';

type Props = {
  disabled?: boolean;
  backTitle?: string;
  nextTitle?: string;
  back: () => void;
  next: () => void;
};

export const BottomButtons: React.FC<Props> = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      }}
    >
      <Button
        onPress={props.back}
        title={props.backTitle ? props.backTitle : 'Back'}
        style={{ backgroundColor: Colors.pine, width: '45%' }}
        titleStyle={{ textAlign: 'center', color: Colors.textLight }}
      />
      <Button
        onPress={props.next}
        title={props.nextTitle ? props.nextTitle : 'Next'}
        disabled={props.disabled}
        style={{ backgroundColor: Colors.salmon, width: '45%' }}
        titleStyle={{ textAlign: 'center' }}
      />
    </View>
  );
};
