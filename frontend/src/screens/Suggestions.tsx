import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Tabs } from '../navigation/tabs';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { FAB } from 'react-native-paper';
import { Colors } from '../theme/colors';
import { Header } from '../components/Header';
import { GET_RECIPES, GET_SUGGESTIONS } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import LottieView from 'lottie-react-native';
import i18next from 'i18next';
import { useIsFocused } from '@react-navigation/native';
import { SuggestionCategoryComponent } from '../components/Suggestions/SuggestionCategoryComponent';
import { getCuisine, getDish } from '../utils/suggestions';
import { LoadingAnimation } from '../components/LoadingAnimation';

export enum Time {
  fast = 'fast',
  moderate = 'moderate',
  slow = 'slow',
}

export const all = i18next.t(`recipes:all`);

export const Suggestions = () => {
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const [suggestions, getSuggestions] = useAuthQuery(GET_SUGGESTIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lottieViewRef = useRef<LottieView>(null);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await refetch();
      })();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setIsRefreshing(true);

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1300);
    });
    await refetch();

    setIsRefreshing(false);
  };

  return (
    <>
      <ScreenBackground>
        <Header title={i18next.t(`recipes:title`)} />
        {isRefreshing && <LoadingAnimation lottieViewRef={lottieViewRef} top={40} />}
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
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
        >
          {data?.getRecipes?.recipes?.length && (
            <SuggestionCategoryComponent
              title={i18next.t('suggestions:recentlyAdded')}
              suggestions={[...data?.getRecipes?.recipes].reverse()}
            />
          )}

          {suggestions?.getSuggestions?.dish?.length &&
            suggestions?.getSuggestions?.dish?.map((suggestion: any) => (
              <SuggestionCategoryComponent
                key={'dish' + suggestion.key}
                title={i18next.t('suggestions:more') + ' ' + getDish(suggestion.key).toLowerCase()}
                suggestions={suggestion.recipes}
              />
            ))}
          {suggestions?.getSuggestions?.cuisine?.length &&
            suggestions?.getSuggestions?.cuisine?.map((suggestion: any) => (
              <SuggestionCategoryComponent
                key={'cuisine' + suggestion.key}
                title={i18next.t('suggestions:more') + ' ' + getCuisine(suggestion.key).toLowerCase()}
                suggestions={suggestion.recipes}
              />
            ))}
        </ScrollView>
      </ScreenBackground>
      <FAB icon="plus" color={Colors.textLight} style={styles.fab} onPress={() => navigation.navigate(Tabs.READ_OCR)} />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 8,
    right: 0,
    top: 75,
    zIndex: 1,
    borderRadius: 30,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    paddingTop: 40,
    paddingBottom: 30,
  },
});
