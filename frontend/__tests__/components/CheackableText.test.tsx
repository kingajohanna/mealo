import '@testing-library/jest-native/extend-expect';
import { render, fireEvent } from '@testing-library/react-native';
import { CheckableText } from '../../src/components/CheckableText';
import { Text } from 'react-native';

describe('CheckableText', () => {
  const props = {
    checkedStyle: { color: 'red' },
    uncheckedStyle: { color: 'blue' },
  };
  it('renders the text with unchecked style by default', () => {
    const { getByText } = render(
      <CheckableText uncheckedStyle={props.uncheckedStyle} checkedStyle={{}}>
        Sample Text
      </CheckableText>,
    );
    const textElement = getByText('Sample Text');

    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toContainEqual(expect.objectContaining({ ...props.uncheckedStyle }));
  });

  it('renders the text with checked style when checked prop is true', () => {
    const { getByText } = render(
      <CheckableText checked checkedStyle={props.checkedStyle}>
        Sample Text
      </CheckableText>,
    );
    const textElement = getByText('Sample Text');

    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toContainEqual(expect.objectContaining({ ...props.checkedStyle }));
  });

  it('toggles the checked state and calls addChecked prop when pressed', () => {
    const addCheckedMock = jest.fn();
    const { getByText } = render(
      <CheckableText
        addChecked={addCheckedMock}
        uncheckedStyle={props.uncheckedStyle}
        checkedStyle={props.checkedStyle}
      >
        Sample Text
      </CheckableText>,
    );
    const textElement = getByText('Sample Text');

    fireEvent.press(textElement);

    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toContainEqual(expect.objectContaining({ ...props.checkedStyle }));
    expect(addCheckedMock).toHaveBeenCalledTimes(1);
    expect(addCheckedMock).toHaveBeenCalledWith(true);

    fireEvent.press(textElement);

    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toContainEqual(expect.objectContaining({ ...props.uncheckedStyle }));
    expect(addCheckedMock).toHaveBeenCalledTimes(2);
    expect(addCheckedMock).toHaveBeenCalledWith(false);
  });
});
