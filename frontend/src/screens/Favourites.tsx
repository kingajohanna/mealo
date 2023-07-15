import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {Header} from '../components/Header';
import {RecipeListComponent} from '../components/RecipeListComponent';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import {Tabs} from '../navigation/tabs';
import {useStore} from '../stores';
import {Recipe} from '../types/recipe';
import LottieView from 'lottie-react-native';
import {RecipeList} from '../components/RecipeList';

export const Favourites = observer(() => {
  const {recipeStore} = useStore();
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const accessPage = (recipe: Recipe) =>
    navigation.navigate(Tabs.RECIPE, {recipe});

  const onRefresh = async () => {
    await recipeStore.refresh();
  };

  return (
    <ScreenBackground>
      <Header title={Tabs.FAVOURITES} />
      <View style={{width: '100%', flex: 1}}>
        <RecipeList
          data={recipeStore.favourites!}
          onRefresh={onRefresh}
          onPress={accessPage}
        />
      </View>
    </ScreenBackground>
  );
});
