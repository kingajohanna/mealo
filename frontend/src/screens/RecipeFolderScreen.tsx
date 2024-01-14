import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { Recipe } from '../types/recipe';
import { RecipeList } from '../components/RecipeList';
import { Colors } from '../theme/colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

type Props = StackScreenProps<RecipeStackParamList, Tabs.RECIPEFOLDER>;

export const RecipeFolderScreen: React.FC<Props> = ({ route, navigation }) => {
  const accessPage = (recipe: Recipe) => navigation.navigate(Tabs.RECIPE, { recipe });

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
