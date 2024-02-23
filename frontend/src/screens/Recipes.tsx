import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Tabs } from '../navigation/tabs';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Recipe } from '../types/recipe';
import { FAB } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SearchModal } from '../components/SearchModal';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { RecipeList } from '../components/RecipeList';
import { GET_RECIPES, GET_SUGGESTIONS } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import i18next from 'i18next';
import { useIsFocused } from '@react-navigation/native';

export enum Time {
  fast = 'fast',
  moderate = 'moderate',
  slow = 'slow',
}

export const all = i18next.t(`recipes:all`);

export const Recipes = () => {
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const [suggestions, refetchS] = useAuthQuery(GET_SUGGESTIONS);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const isFocused = useIsFocused();

  const [filteredRecipes, setFilteredRecipes] = useState(data?.getRecipes.recipes);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(all);
  const [cuisine, setCuisine] = useState(all);
  const [time, setTime] = useState<Time | undefined>(undefined);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    console.log(suggestions?.getSuggestions?.recipes);
  }, [suggestions]);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await refetch();
      })();
    }
  }, [isFocused]);

  useEffect(() => {
    if (data?.getRecipes.recipes) {
      setFilteredRecipes(data?.getRecipes.recipes);
    }
  }, [data?.getRecipes.recipes]);

  const reset = () => {
    setText('');
    setCategory(all);
    setCuisine(all);
    setTime(undefined);
    setFilteredRecipes(data?.getRecipes.recipes);
  };

  useEffect(() => {
    if (data?.getRecipes.recipes.length) {
      if (
        category === i18next.t(`recipes:all`) &&
        cuisine === i18next.t(`recipes:all`) &&
        text === '' &&
        time === undefined
      ) {
        return setFilteredRecipes(data?.getRecipes.recipes);
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

      const filteredRecipes = data?.getRecipes.recipes.filter(filter);

      return setFilteredRecipes(filteredRecipes);
    }
  }, [text, category, cuisine, time, data?.getRecipes.recipes]);

  const accessPage = (recipe: Recipe) => {
    navigation.navigate(Tabs.RECIPE, { recipe });
  };

  return (
    <>
      <ScreenBackground>
        <Header title={i18next.t(`recipes:title`)} />
        <View style={styles.contentContainer}>
          <RecipeList
            data={
              data?.getRecipes.recipes.length !== filteredRecipes?.length ? filteredRecipes : data?.getRecipes.recipes
            }
            onPress={accessPage}
          />
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
      <FAB
        icon="plus"
        color={Colors.textLight}
        style={[styles.fab, { right: 70 }]}
        onPress={() => navigation.navigate(Tabs.READ_OCR)}
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
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
  },
});
