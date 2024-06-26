import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { AppNav } from '../navigation/tabs';
import { Recipe } from '../types/recipe';
import { RecipeList } from '../components/Recipes/RecipeList';
import { Colors } from '../theme/colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import i18next from 'i18next';

type Props = StackScreenProps<RecipeStackParamList, AppNav.RECIPEFOLDER>;

export const all = i18next.t(`recipes:all`);

export const RecipeFolderScreen: React.FC<Props> = ({ route, navigation }) => {
  const accessPage = (recipe: Recipe) => navigation.navigate(AppNav.RECIPE, { recipe });
  const renderBack = (
    <SimpleLineIcons name="arrow-left" size={25} color={Colors.beige} onPress={() => navigation.goBack()} />
  );

  return (
    <ScreenBackground>
      <Header title={route.params.filter} leftAction={renderBack} />
      <View style={styles.container}>
        <RecipeList data={route.params.recipes} onPress={accessPage} searchEnabled />
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingTop: 40,
  },
});
