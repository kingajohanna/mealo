import LottieView from 'lottie-react-native';
import React from 'react';

type Props = {
  lottieViewRef: React.RefObject<LottieView>;
  refreshingHeight?: number;
  top?: number;
};

export const LoadingAnimation: React.FC<Props> = ({ lottieViewRef, refreshingHeight = 130, top }) => {
  return (
    <LottieView
      style={{
        height: refreshingHeight,
        position: 'absolute',
        top: top || 0,
        left: 0,
        right: 0,
      }}
      ref={lottieViewRef}
      source={require('../assets/anim/loading.json')}
      loop
      autoPlay
    />
  );
};
