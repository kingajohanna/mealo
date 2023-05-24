import {FC, useEffect, useRef, useState} from 'react';
import {Recipe} from '../types/recipe';
import {Animated, Easing, FlatList, RefreshControl, View} from 'react-native';
import {RecipeListComponent} from './RecipeListComponent';
import LottieView from 'lottie-react-native';
import {observer} from 'mobx-react-lite';

interface Props {
  data: Recipe[];
  onRefresh: () => Promise<void>;
  onPress: (r: Recipe) => void;
}

export const RecipeList: FC<Props> = props => {
  const [offsetY, setOffsetY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [extraPaddingTop] = useState(new Animated.Value(0));
  const refreshingHeight = 150;
  const lottieViewRef = useRef<LottieView>(null);

  useEffect(() => {
    if (isRefreshing) {
      Animated.timing(extraPaddingTop, {
        toValue: refreshingHeight,
        duration: 0,
        useNativeDriver: false,
      }).start();
      lottieViewRef.current?.play();
    } else {
      Animated.timing(extraPaddingTop, {
        toValue: 0,
        duration: 400,
        easing: Easing.elastic(1.3),
        useNativeDriver: false,
      }).start();
    }
  }, [isRefreshing]);

  function onScroll(event: {nativeEvent: any}) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
  }

  function onRelease() {
    if (offsetY <= -refreshingHeight - 20 && !isRefreshing) {
      setIsRefreshing(true);
      props.onRefresh().then(() => setIsRefreshing(false));
    }
  }

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

  if (props.data.length)
    return (
      <>
        <LottieView
          style={{
            height: refreshingHeight,
            position: 'absolute',
            top: 5,
            left: 0,
            right: 0,
          }}
          ref={lottieViewRef}
          source={require('../assets/anim/loading.json')}
          loop
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={props.data}
          renderItem={({item, index}) => renderItem(item, index)}
          keyExtractor={item => item.id!}
          onScroll={onScroll}
          onResponderRelease={onRelease}
          ListHeaderComponent={
            <Animated.View
              style={{
                paddingTop: extraPaddingTop,
              }}
            />
          }
        />
      </>
    );

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={props.data}
        renderItem={({item, index}) => renderItem(item, index)}
        keyExtractor={item => item.id!}
        onScroll={onScroll}
        onResponderRelease={onRelease}
        ListHeaderComponent={
          <Animated.View
            style={{
              paddingTop: extraPaddingTop,
            }}
          />
        }
      />
    </>
  );
};
