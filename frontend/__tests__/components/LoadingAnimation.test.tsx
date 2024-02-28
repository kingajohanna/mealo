import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingAnimation } from '../../src/components/LoadingAnimation';
import LottieView from 'lottie-react-native';

describe('LoadingAnimation', () => {
  it('renders the loading animation', () => {
    const lottieViewRef = React.createRef<LottieView>();
    const { getByTestId } = render(<LoadingAnimation lottieViewRef={lottieViewRef} />);

    const loadingAnimation = getByTestId('loading-animation');
    expect(loadingAnimation).toBeTruthy();
  });
});
