import React from 'react';
import { render } from '@testing-library/react-native';
import { Header } from '../../src/components/Header';
import { Text } from 'react-native';

describe('Header', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<Header title="Test Title" />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders the left action correctly', () => {
    const leftAction = <Text>Left Action</Text>;
    const { getByText } = render(<Header title="Test Title" leftAction={leftAction} />);
    expect(getByText('Left Action')).toBeTruthy();
  });

  it('renders the right action correctly', () => {
    const rightAction = <Text>Right Action</Text>;
    const { getByText } = render(<Header title="Test Title" rightAction={rightAction} />);
    expect(getByText('Right Action')).toBeTruthy();
  });
});
