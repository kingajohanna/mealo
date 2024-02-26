import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { getCategory, getCuisine, getDish } from '../../utils/suggestions';

export enum SuggestionBubbleType {
  CUISINE = 'cuisine',
  CATEGORY = 'category',
  DISH = 'dish',
}

type Props = {
  text: string;
  type: SuggestionBubbleType;
  selected: boolean;
} & PressableProps;

export const SuggestionBubble: React.FC<Props> = ({ text, type, selected, ...props }) => {
  return (
    <Pressable style={[styles.container, { backgroundColor: selected ? Colors.pine : Colors.beige }]} {...props}>
      <Text style={styles.title}>{text || ''}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  selected: {
    backgroundColor: Colors.salmon,
  },
  container: {
    borderColor: Colors.pine,
    borderRadius: 16,
    borderWidth: 1,
    flexShrink: 1,
    padding: 5,
    margin: 2,
  },
  title: {
    fontSize: 14,
    color: Colors.textDark,
  },
});
