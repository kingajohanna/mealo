import { FC, useEffect, useRef, useState } from 'react';
import { Recipe } from '../../types/recipe';
import { FlatList, RefreshControl, View } from 'react-native';
import { RecipeListComponentMemorized } from './RecipeListComponent';
import { RecipeListSwipeableComponentMemorized } from './RecipeListSwipeableComponent';
import LottieView from 'lottie-react-native';
import { GET_RECIPES } from '../../api/queries';
import { useAuthQuery } from '../../hooks/useAuthQuery';
import { TextInput } from '../TextInput';
import i18next from 'i18next';
import { LoadingAnimation } from '../LoadingAnimation';

interface Props {
  data: Recipe[];
  onPress: (r: Recipe) => void;
  searchEnabled?: boolean;
}

export const RecipeList: FC<Props> = (props) => {
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lottieViewRef = useRef<LottieView>(null);
  const [searchText, onChangeText] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>(props.data);

  useEffect(() => {
    if (props.data) {
      setRecipes(props.data.filter((recipe: Recipe) => recipe.title.toLowerCase().includes(searchText.toLowerCase())));
    }
  }, [searchText, props.data]);

  const renderItem = (item: Recipe, index: number) => {
    const paddingTop = index === 0 ? (props.searchEnabled ? 0 : 25) : 0;
    const paddingBottom = index === props.data.length - 1 ? 30 : 0;

    return (
      <View style={{ paddingTop, paddingBottom }}>
        {item.id ? (
          <RecipeListSwipeableComponentMemorized recipe={item} onPress={() => props.onPress(item)} />
        ) : (
          <RecipeListComponentMemorized recipe={item} onPress={() => props.onPress(item)} />
        )}
      </View>
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);

    await refetch();

    setIsRefreshing(false);
  };

  return (
    <>
      {isRefreshing && <LoadingAnimation lottieViewRef={lottieViewRef} />}
      {props.searchEnabled && (
        <TextInput onChangeText={onChangeText} text={searchText} placeholder={i18next.t(`recipes:searchModalTitle`)} />
      )}
      <FlatList
        data={recipes || props.data}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item) => item._id + Math.random().toString()}
        refreshControl={
          <RefreshControl
            onLayout={(e) => console.log(e.nativeEvent)}
            tintColor="transparent"
            colors={['transparent']}
            style={{ backgroundColor: 'transparent' }}
            refreshing={isRefreshing}
            onRefresh={() => onRefresh()}
          />
        }
      />
    </>
  );
};
