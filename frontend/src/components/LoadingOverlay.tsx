import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

export const LoadingOverlay: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={{
          height: 400,
          position: 'absolute',
          alignSelf: 'center',
          top: '25%',
          left: 0,
          right: 0,
        }}
        source={require('../assets/anim/loading.json')}
        loop
        autoPlay
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
