import { Text } from 'react-native-paper';
import { Recipe } from '../../types/recipe';
import React, { memo } from 'react';
import { RecipesHorizontal } from './RecipesHorizontal';
import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

type Props = {
  title: string;
  suggestions: Recipe[];
};

export const SuggestionCategoryComponent: React.FC<Props> = memo(({ title, suggestions }) => {
  return (
    <>
      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>
      <RecipesHorizontal suggestions={suggestions} />
    </>
  );
});

const styles = StyleSheet.create({
  title: {
    marginLeft: 8,
    color: Colors.textDark,
  },
});
