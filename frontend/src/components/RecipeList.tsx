import {FC, useRef, useState} from 'react';
import {Recipe} from '../types/recipe';
import {FlatList, RefreshControl, View} from 'react-native';
import {RecipeListComponent} from './RecipeListComponent';
import LottieView from 'lottie-react-native';
import {GET_RECIPES} from '../api/queries';
import {useQuery} from '@apollo/client';

interface Props {
  data: Recipe[];
  onPress: (r: Recipe) => void;
}

export const RecipeList: FC<Props> = props => {
  const {refetch} = useQuery(GET_RECIPES);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshingHeight = 130;
  const lottieViewRef = useRef<LottieView>(null);

  const renderItem = (item: Recipe, index: number) => {
    const paddingTop = index === 0 ? 25 : 0;
    const paddingBottom = index === props.data.length - 1 ? 30 : 0;

    return (
      <View style={{paddingTop, paddingBottom}}>
        <RecipeListComponent
          recipe={item}
          onPress={() => props.onPress(item)}
        />
      </View>
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);

    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 700);
    });
    refetch();

    setIsRefreshing(false);
  };

  return (
    <>
      {isRefreshing ? (
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
      ) : null}
      <FlatList
        data={props.data}
        renderItem={({item, index}) => renderItem(item, index)}
        keyExtractor={item => item.id!}
        refreshControl={
          <RefreshControl
            onLayout={e => console.log(e.nativeEvent)}
            tintColor="transparent"
            colors={['transparent']}
            style={{backgroundColor: 'transparent'}}
            refreshing={isRefreshing}
            onRefresh={() => onRefresh()}
          />
        }
      />
    </>
  );
};
