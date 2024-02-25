import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { Recipe } from '../types/recipe';
import { RecipeList } from '../components/Recipes/RecipeList';
import { Colors } from '../theme/colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { SearchModal } from '../components/SearchModal';
import { useEffect, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import i18next from 'i18next';
import { Time } from './Recipes';
import { FAB } from 'react-native-paper';

type Props = StackScreenProps<RecipeStackParamList, Tabs.RECIPEFOLDER>;

export const all = i18next.t(`recipes:all`);

export const RecipeFolderScreen: React.FC<Props> = ({ route, navigation }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const accessPage = (recipe: Recipe) => navigation.navigate(Tabs.RECIPE, { recipe });

  const [filteredRecipes, setFilteredRecipes] = useState(route.params.recipes);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(all);
  const [cuisine, setCuisine] = useState(all);
  const [time, setTime] = useState<Time | undefined>(undefined);

  const reset = () => {
    setText('');
    setCategory(all);
    setCuisine(all);
    setTime(undefined);
    setFilteredRecipes(route.params.recipes);
  };

  useEffect(() => {
    if (route.params.recipes.length) {
      if (
        category === i18next.t(`recipes:all`) &&
        cuisine === i18next.t(`recipes:all`) &&
        text === '' &&
        time === undefined
      ) {
        return setFilteredRecipes(route.params.recipes);
      }

      const keys: string[] = [];
      const values: string[] = [];

      if (category !== all) {
        keys.push('category');
        values.push(category);
      }

      if (cuisine !== all) {
        keys.push('cuisine');
        values.push(cuisine);
      }

      if (text) {
        keys.push('title');
        values.push(text);
      }

      if (time) {
        keys.push('speed');
        values.push(time);
      }

      const filter = (recipe: Recipe) => {
        return keys.every((key, i) => {
          const value = recipe[key];
          return typeof value === 'string' && value.toLowerCase().includes(values[i].toLowerCase());
        });
      };

      const filteredRecipes = route.params.recipes.filter(filter);

      return setFilteredRecipes(filteredRecipes);
    }
  }, [text, category, cuisine, time, route.params.recipes]);

  const renderBack = (
    <SimpleLineIcons name="arrow-left" size={25} color={Colors.beige} onPress={() => navigation.goBack()} />
  );

  return (
    <>
      <ScreenBackground>
        <Header title={route.params.filter} leftAction={renderBack} />
        <View style={styles.container}>
          <RecipeList data={filteredRecipes} onPress={accessPage} searchEnabled />
        </View>
        <SearchModal
          refRBSheet={bottomSheetModalRef}
          onChangeText={setText}
          text={text}
          time={time}
          setTime={setTime}
          category={category}
          setCategory={setCategory}
          cuisine={cuisine}
          setCuisine={setCuisine}
          reset={reset}
          search={() => bottomSheetModalRef.current?.dismiss()}
        />
      </ScreenBackground>
      <FAB
        icon="magnify"
        color={Colors.textLight}
        style={styles.fab}
        onPress={() => bottomSheetModalRef.current?.present()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 8,
    right: 0,
    top: 75,
    zIndex: 1,
    borderRadius: 30,
  },
  container: {
    width: '100%',
    flex: 1,
    paddingTop: 40,
  },
});
