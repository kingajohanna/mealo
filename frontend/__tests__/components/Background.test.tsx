import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScreenBackground } from '../../src/components/Background';
import { Colors } from '../../src/theme/colors';

describe('ScreenBackground', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ScreenBackground>
        <Text>Test Content</Text>
      </ScreenBackground>,
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders with default background color', () => {
    const { getByTestId } = render(<ScreenBackground />);

    const background = getByTestId('background');

    expect(background.props.style[1].backgroundColor).toBe(Colors.pine);
  });

  it('renders with custom notification bar color', () => {
    const { getByTestId } = render(<ScreenBackground notificationBarColor="#FF0000" />);

    const background = getByTestId('background');
    expect(background.props.style[1].backgroundColor).toBe('#FF0000');
  });

  it('renders with default fullscreen background color', () => {
    const { getByTestId } = render(<ScreenBackground fullscreen />);

    const fullscreenBackground = getByTestId('fullscreen-background');
    expect(fullscreenBackground.props.style.backgroundColor).toBe(Colors.beige);
  });
});
