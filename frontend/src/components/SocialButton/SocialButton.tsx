import * as React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';

/**
 * ? Local Imports
 */
import styles, {_shadowStyle, _container} from './SocialButton.style';

interface ISocialButtonProps {
  text?: string;
  shadowColor?: string;
  backgroundColor?: string;
  width?: number | string;
  height?: number | string;
  component?: React.ReactNode;
  loginButtonTextStyle?: any;
  isSpinner?: boolean;
  spinnerSize?: number;
  spinnerType?: string;
  spinnerColor?: string;
  onPress: () => void;
}

const SocialButton = (props: ISocialButtonProps) => {
  const {
    text,
    component,
    height = 85,
    width = '50%',
    loginButtonTextStyle,
    shadowColor = '#757575',
    backgroundColor = '#69bc4c',
    isSpinner = false,
    spinnerSize = 16,
    spinnerType = 'Circle',
    spinnerColor = '#fff',
    onPress,
  } = props;

  return (
    <TouchableOpacity
      style={_container(width, height, backgroundColor)}
      onPress={onPress}>
      {isSpinner ? (
        <ActivityIndicator size="small" />
      ) : (
        component || (
          <Text style={[styles.buttonTextStyle, loginButtonTextStyle]}>
            {text}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
};

export default SocialButton;
