import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { Recipe } from '../types/recipe';
import { RecipeList } from '../components/RecipeList';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import i18next from 'i18next';

export const Favourites = () => {
  const [refetch, data] = useAuthQuery(GET_RECIPES);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const accessPage = (recipe: Recipe) => navigation.navigate(Tabs.RECIPE, { recipe });

  return (
    <ScreenBackground>
      <Header title={i18next.t('favorites:title')} />
      <View style={{ width: '100%', flex: 1 }}>
        <RecipeList
          data={data?.getRecipes.recipes.filter((recipe: Recipe) => recipe.is_favorite === true)}
          onPress={accessPage}
        />
      </View>
    </ScreenBackground>
  );
};
