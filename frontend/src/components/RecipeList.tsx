import { FC, useEffect, useRef, useState } from 'react';
import { Recipe } from '../types/recipe';
import { FlatList, RefreshControl, View } from 'react-native';
import { RecipeListComponentMemoized } from './RecipeListComponent';
import LottieView from 'lottie-react-native';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { TextInput } from './TextInput';
import i18next from 'i18next';

interface Props {
  data: Recipe[];
  onPress: (r: Recipe) => void;
  searchEnabled?: boolean;
}

export const RecipeList: FC<Props> = (props) => {
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshingHeight = 130;
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
        <RecipeListComponentMemoized recipe={item} onPress={() => props.onPress(item)} />
      </View>
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 700);
    });
    await refetch();

    setIsRefreshing(false);
  };

  const loadingAnimation = isRefreshing ? (
    <LottieView
      style={{
        height: refreshingHeight,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}
      ref={lottieViewRef}
      source={require('../assets/anim/loading.json')}
      loop
      autoPlay
    />
  ) : null;

  return (
    <>
      {loadingAnimation}
      {props.searchEnabled && (
        <TextInput onChangeText={onChangeText} text={searchText} placeholder={i18next.t(`recipes:searchModalTitle`)} />
      )}
      <FlatList
        data={recipes || props.data}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item) => 'recipe' + item.id}
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
