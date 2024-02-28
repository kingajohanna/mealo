import React, { useCallback, useState } from 'react';
import { FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Colors } from '../theme/colors';
import Dots from 'react-native-dots-pagination';

type Props = {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => JSX.Element;
};
export const Carousel: React.FC<Props> = (props) => {
  const [activeDot, setActiveDot] = useState(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveDot(roundIndex);
  }, []);

  return (
    <>
      <FlatList
        testID="carousel-flatlist"
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        data={props.data}
        onScroll={onScroll}
        renderItem={props.renderItem}
      />
      <Dots length={props.data.length} active={activeDot} activeColor={Colors.pine} />
    </>
  );
};
