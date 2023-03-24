import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {Recipe} from '../types/recipe';
import {FAB} from 'react-native-paper';

export enum Time {
  fast = 'fast',
  moderate = 'moderate',
  slow = 'slow',
}

export const Recipes = observer(() => {
  const {recipeStore} = useStore();

  const [refreshing, setRefreshing] = useState(false);

  const [recipes, setRecipes] = useState(recipeStore.recipes);

  const renderItem = (object: ListRenderItemInfo<Recipe>) => {
    const {item} = object;
    return <RecipeListComponent recipe={item} />;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await recipeStore.refresh();
    setRefreshing(false);
  };

  return (
    <ScreenBackground title={Tabs.RECIPES}>
      <View style={{width: '100%', flex: 1}}>
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={item => item._id!}
          refreshing={refreshing}
          onRefresh={() => onRefresh()}
        />
      </View>
      <FAB icon="magnify" style={styles.fab} />
    </ScreenBackground>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 0,
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
