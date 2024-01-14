import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import { CalendarDay } from '../components/CalendarDay';
import { useIsFocused } from '@react-navigation/native';

const minusDays = 3;
const plusDays = 14;

export const CalendarScreen = () => {
  const [data] = useAuthQuery(GET_RECIPES);
  const isFocused = useIsFocused();

  const [dates, setDates] = useState<moment.Moment[]>([]);

  useEffect(() => {
    if (isFocused) {
      setDates([]);
      var currDate = moment(moment().subtract(minusDays, 'days')).startOf('day');
      var lastDate = moment(moment().add(plusDays, 'days')).startOf('day');

      let temp = [];
      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        temp.push(currDate.clone());
      }
      setDates(temp);
    }
  }, [isFocused]);

  return (
    <>
      <ScreenBackground style={{ paddingTop: 10 }}>
        <Header title={i18next.t('calendar:title')} />
        {dates.length > 0 ? (
          <View style={styles.container}>
            <FlatList
              data={dates}
              showsVerticalScrollIndicator={false}
              numColumns={1}
              keyExtractor={(item) => item.toDate().toString()}
              renderItem={({ item }) => (
                <CalendarDay date={item} recipes={data?.getRecipes?.recipes} key={item.toString()} />
              )}
            />
          </View>
        ) : (
          <LottieView
            style={{
              height: 400,
            }}
            ref={null}
            source={require('../assets/anim/loading.json')}
            loop
            autoPlay
          />
        )}
      </ScreenBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    width: '100%',
    padding: 30,
  },
});
