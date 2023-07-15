import {FC, useRef, useState} from 'react';
import {Recipe} from '../types/recipe';
import {FlatList, RefreshControl, View} from 'react-native';
import {RecipeListComponent} from './RecipeListComponent';
import LottieView from 'lottie-react-native';

interface Props {
  data: Recipe[];
  onRefresh: () => Promise<void>;
  onPress: (r: Recipe) => void;
}

export const RecipeList: FC<Props> = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshingHeight = 130;
  const lottieViewRef = useRef<LottieView>(null);

  const renderItem = (item: Recipe, index: number) => {
    if (index === 0) {
      return (
        <View style={{paddingTop: 25}}>
          <RecipeListComponent
            recipe={item}
            onPress={() => props.onPress(item)}
          />
        </View>
      );
    }
    if (index === props.data.length - 1) {
      return (
        <View style={{paddingBottom: 30}}>
          <RecipeListComponent
            recipe={item}
            onPress={() => props.onPress(item)}
          />
        </View>
      );
    }
    return (
      <RecipeListComponent recipe={item} onPress={() => props.onPress(item)} />
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await props.onRefresh();
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
