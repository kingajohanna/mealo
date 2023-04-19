import {FC} from 'react';
import {Recipe} from '../types/recipe';
import {FlatList, View} from 'react-native';
import {RecipeListComponent} from './RecipeListComponent';

interface Props {
  data: Recipe[];
  refreshing: boolean;
  onRefresh: () => {};
  onPress: (r: Recipe) => void;
}

export const RecipeList: FC<Props> = props => {
  const renderItem = (item: Recipe, index: number) => {
    if (index === 0)
      return (
        <View style={{paddingTop: 25}}>
          <RecipeListComponent
            recipe={item}
            onPress={() => props.onPress(item)}
          />
        </View>
      );
    if (index === props.data.length - 1)
      return (
        <View style={{paddingBottom: 30}}>
          <RecipeListComponent
            recipe={item}
            onPress={() => props.onPress(item)}
          />
        </View>
      );
    return (
      <RecipeListComponent recipe={item} onPress={() => props.onPress(item)} />
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={props.data}
      renderItem={({item, index}) => renderItem(item, index)}
      keyExtractor={item => item.id!}
      refreshing={props.refreshing}
      onRefresh={props.onRefresh}
    />
  );
};
