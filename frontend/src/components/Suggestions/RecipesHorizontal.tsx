import React, { memo } from 'react';
import { Recipe } from '../../types/recipe';
import { FlatList, View } from 'react-native';
import { RecipeSuggestionComponent } from './RecipeSuggestionComponent';
import { useNavigation } from '@react-navigation/native';
import { AppNav } from '../../navigation/tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecipeStackParamList } from '../../navigation/AppNavigator';

type Props = {
  suggestions: Recipe[];
};

const MAX_SUGGESTIONS = 5;
export const RecipesHorizontal: React.FC<Props> = memo(({ suggestions }) => {
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const suggestionsWithMore: Recipe[] = [
    ...suggestions.slice(0, MAX_SUGGESTIONS),
    {
      _id: 'more',
      id: 'more',
      title: 'More...',
      image: '../../assets/images/moreBg.png',
      ingredients: [],
      instructions: [],
      totalTime: '',
    },
  ];

  const onOpenRecipe = (recipe: Recipe) => {
    if (recipe.id === 'more') {
      navigation.navigate(AppNav.RECIPES, { recipes: suggestions });
    } else navigation.navigate(AppNav.RECIPE, { recipe });
  };

  return (
    <View>
      <FlatList
        horizontal
        data={suggestionsWithMore}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RecipeSuggestionComponent recipe={item} onPress={() => onOpenRecipe(item)} isMore={item.id === 'more'} />
        )}
      />
    </View>
  );
});
