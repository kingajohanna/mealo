import '@testing-library/jest-native/extend-expect';
import { render, fireEvent } from '@testing-library/react-native';
import { Carousel } from '../../src/components/Carousel';
import { Text } from 'react-native';

describe('Carousel', () => {
  const data = [
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' },
  ];

  const renderItem = ({ item }: { item: any }) => <Text>{item.title}</Text>;

  it('renders the carousel with correct items', () => {
    const { getByText } = render(<Carousel data={data} renderItem={renderItem} />);

    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });
});
