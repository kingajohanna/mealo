import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Recipe} from '../types/recipe';
import {FAB} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {all} from '../stores/RecipeStore';
import {SearchModal} from '../components/SearchModal';
import {Colors} from '../theme/colors';
import {Header} from '../components/Header';
import {RecipeList} from '../components/RecipeList';

export enum Time {
  fast = 'fast',
  moderate = 'moderate',
  slow = 'slow',
}

export const Recipes = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const [recipes, setRecipes] = useState(recipeStore.recipes!);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(all);
  const [cuisine, setCuisine] = useState(all);
  const [time, setTime] = useState<Time | undefined>(undefined);

  const refRBSheet = useRef() as React.MutableRefObject<RBSheet>;

  const reset = () => {
    setText('');
    setCategory(all);
    setCuisine(all);
    setTime(undefined);
    setRecipes(recipeStore.recipes);
  };

  useEffect(() => {
    if (recipeStore.recipes?.length) {
      if (
        category === all &&
        cuisine === all &&
        text === '' &&
        time === undefined
      ) {
        return setRecipes(recipeStore.recipes);
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
        for (let i = 0; i < keys.length; i++) {
          const value = recipe[keys[i]];
          if (
            typeof value === 'string' &&
            value.toLowerCase().includes(values[i].toLowerCase())
          ) {
            continue;
          }
          return false;
        }
        return true;
      };

      const filteredRecipes = recipeStore.recipes?.filter(filter);

      return setRecipes(filteredRecipes);
    }
  }, [text, category, cuisine, time, recipeStore.recipes]);

  const accessPage = (recipe: Recipe) =>
    navigation.navigate(Tabs.RECIPE, {recipe});

  const onRefresh = async () => {
    await recipeStore.refresh();
  };

  return (
    <>
      <ScreenBackground>
        <Header title={Tabs.RECIPES} />
        <View style={{width: '100%', flex: 1}}>
          <RecipeList
            data={recipes}
            onRefresh={onRefresh}
            onPress={accessPage}
          />
        </View>

        <SearchModal
          refRBSheet={refRBSheet}
          onChangeText={setText}
          text={text}
          time={time}
          setTime={setTime}
          category={category}
          setCategory={setCategory}
          cuisine={cuisine}
          setCuisine={setCuisine}
          reset={reset}
          search={() => refRBSheet.current!.close()}
        />
      </ScreenBackground>
      <FAB
        icon="magnify"
        color={Colors.textLight}
        style={styles.fab}
        onPress={() => refRBSheet.current!.open()}
      />
    </>
  );
});

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
    flex: 1,
    alignItems: 'center',
  },
});
