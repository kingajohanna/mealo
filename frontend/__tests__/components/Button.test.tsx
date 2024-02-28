import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/Button';
import { View } from 'react-native';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <Button
        testID="myButton"
        disabled={false}
        style={{}}
        onPress={() => {}}
        icon={<View testID="myIcon" />}
        title="Submit"
        titleStyle={{}}
      />,
    );

    const button = getByTestId('myButton');
    const icon = getByTestId('myIcon');
    const title = getByText('Submit');

    expect(button).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(title).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button
        testID="myButton"
        disabled={false}
        style={{}}
        onPress={onPressMock}
        icon={<View testID="myIcon" />}
        title="Submit"
        titleStyle={{}}
      />,
    );

    const button = getByTestId('myButton');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalled();
  });

  it('disables the button when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button
        testID="myButton"
        disabled
        style={{}}
        onPress={() => {}}
        icon={<View testID="myIcon" />}
        titleStyle={{}}
      />,
    );

    const button = getByTestId('myButton');

    const opacity = button.props.style.find((style: any) => style.opacity !== undefined).opacity;
    expect(opacity).toBe(0.5);
  });
});
