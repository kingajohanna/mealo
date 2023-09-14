import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {View} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {Header} from '../components/Header';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Tabs} from '../navigation/tabs';
import {Recipe} from '../types/recipe';
import {RecipeList} from '../components/RecipeList';
import {useQuery} from '@apollo/client';
import {GET_RECIPES} from '../api/queries';

export const Favourites = () => {
  const {data} = useQuery(GET_RECIPES);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const accessPage = (recipe: Recipe) =>
    navigation.navigate(Tabs.RECIPE, {recipe});

  return (
    <ScreenBackground>
      <Header title={Tabs.FAVOURITES} />
      <View style={{width: '100%', flex: 1}}>
        <RecipeList
          data={data?.getRecipes.filter(
            (recipe: Recipe) => recipe.is_favorite === true,
          )}
          onPress={accessPage}
        />
      </View>
    </ScreenBackground>
  );
};
