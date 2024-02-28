import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomButtons } from '../../src/components/BottomButtons';

describe('BottomButtons', () => {
  const mockBack = jest.fn();
  const mockNext = jest.fn();

  const defaultProps = {
    disabled: false,
    backTitle: 'Back',
    nextTitle: 'Next',
    back: mockBack,
    next: mockNext,
    buttonStyle: {},
    containerStyle: {},
  };

  it('renders correctly with default props', () => {
    const { getByText } = render(<BottomButtons {...defaultProps} />);
    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('calls the back function when back button is pressed', () => {
    const { getByText } = render(<BottomButtons {...defaultProps} />);
    fireEvent.press(getByText('Back'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('calls the next function when next button is pressed', () => {
    const { getByText } = render(<BottomButtons {...defaultProps} />);
    fireEvent.press(getByText('Next'));
    expect(mockNext).toHaveBeenCalled();
  });

  it('renders correctly without title props', () => {
    const { getByText, getByTestId } = render(<BottomButtons back={mockBack} next={mockNext} />);
    expect(getByTestId('backButton')).toBeTruthy();
    expect(getByTestId('nextButton')).toBeTruthy();
  });

  // Add more test cases as needed
});
