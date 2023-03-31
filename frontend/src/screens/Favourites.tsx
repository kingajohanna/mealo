import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {Header} from '../components/Header';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {Recipe} from '../types/recipe';

export const Favourites = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  const accessPage = (recipe: Recipe) =>
    navigation.navigate(Tabs.RECIPE, {recipe});

  const renderItem = (item: Recipe, index: number) => {
    if (index === recipeStore.favourites?.length - 1)
      return (
        <View style={{paddingBottom: 30}}>
          <RecipeListComponent recipe={item} onPress={() => accessPage(item)} />
        </View>
      );
    if (index === 0)
      return (
        <View style={{paddingTop: 25}}>
          <RecipeListComponent recipe={item} onPress={() => accessPage(item)} />
        </View>
      );
    return (
      <RecipeListComponent recipe={item} onPress={() => accessPage(item)} />
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await recipeStore.refresh();
    setRefreshing(false);
  };

  return (
    <ScreenBackground>
      <Header title={Tabs.FAVOURITES} />
      <View style={{width: '100%', flex: 1}}>
        <FlatList
          data={recipeStore.favourites}
          renderItem={({item, index}) => renderItem(item, index)}
          keyExtractor={item => item.id!}
          refreshing={refreshing}
          onRefresh={() => onRefresh()}
        />
      </View>
    </ScreenBackground>
  );
});
