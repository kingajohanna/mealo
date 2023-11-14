import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
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
import { Colors } from '../theme/colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

type Props = StackScreenProps<RecipeStackParamList, Tabs.RECIPEFOLDER>;

export const RecipeFolderScreen: React.FC<Props> = ({ route, navigation }) => {
  const [refetch, data] = useAuthQuery(GET_RECIPES);

  const accessPage = (recipe: Recipe) => navigation.navigate(Tabs.RECIPE, { recipe });

  const renderBack = (
    <SimpleLineIcons name="arrow-left" size={25} color={Colors.beige} onPress={() => navigation.goBack()} />
  );

  return (
    <ScreenBackground>
      <Header title={route.params.filter} leftAction={renderBack} />
      <View style={{ width: '100%', flex: 1 }}>
        <RecipeList
          data={data?.getRecipes.recipes.filter((recipe: Recipe) => recipe.folders?.includes(route.params.filter))}
          onPress={accessPage}
        />
      </View>
    </ScreenBackground>
  );
};
