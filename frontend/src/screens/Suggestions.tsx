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
import { GET_RECIPES, GET_SUGGESTIONS, GET_SEARCH_RESULTS } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import LottieView from 'lottie-react-native';
import i18next from 'i18next';
import { SuggestionCategoryComponent } from '../components/Suggestions/SuggestionCategoryComponent';
import { getCuisine, getDish } from '../utils/suggestions';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { SearchComponent } from '../components/Suggestions/SearchComponent';
import { SuggestionBubbleType } from '../components/Suggestions/SuggestionBubble';
import { useOnForegroundFocus } from '../hooks/useOnForeGroundFocus';

export enum Time {
  fast = 'fast',
  moderate = 'moderate',
  slow = 'slow',
}

export type Tag = {
  name: string;
  type: SuggestionBubbleType;
  selected: boolean;
  id: number;
};

export const all = i18next.t(`recipes:all`);

export const Suggestions = () => {
  const [text, setText] = useState('');
  const [searchIsActive, setSearchIsActive] = useState(false);
  const [categoryTags, setCategoryTags] = useState<Tag[]>([]);
  const [cuisineTags, setCuisineTags] = useState<Tag[]>([]);
  const [dishTags, setDishTags] = useState<Tag[]>([]);
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const [searchData, getSearchResults] = useAuthQuery(GET_SEARCH_RESULTS, {
    variables: {
      title: '',
      cuisine: [],
      dish: [],
      category: [],
    },
  });
  const [suggestions, getSuggestions] = useAuthQuery(GET_SUGGESTIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lottieViewRef = useRef<LottieView>(null);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  useOnForegroundFocus(() => {
    (async () => {
      await refetch();
    })();
  });

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

  const search = async () => {
    const cuisine = cuisineTags.filter((tag) => tag.selected).map((tag) => tag.id);
    const dish = dishTags.filter((tag) => tag.selected).map((tag) => tag.id);
    const category = categoryTags.filter((tag) => tag.selected).map((tag) => tag.id);

    await getSearchResults({ title: text.toString(), cuisine, dish, category });
  };

  const renderSuggestions = () => {
    return (
      <>
        {data?.getRecipes?.recipes?.length > 0 && (
          <SuggestionCategoryComponent
            title={i18next.t('suggestions:recentlyAdded')}
            suggestions={[...data?.getRecipes?.recipes]}
          />
        )}

        {suggestions?.getSuggestions?.dish?.length > 0 &&
          suggestions?.getSuggestions?.dish?.map((suggestion: any) => (
            <SuggestionCategoryComponent
              key={'dish' + suggestion.key}
              title={i18next.t('suggestions:more') + ' ' + getDish(suggestion.key).toLowerCase()}
              suggestions={suggestion.recipes}
            />
          ))}
        {suggestions?.getSuggestions?.cuisine?.length > 0 &&
          suggestions?.getSuggestions?.cuisine?.map((suggestion: any) => (
            <SuggestionCategoryComponent
              key={'cuisine' + suggestion.key}
              title={i18next.t('suggestions:more') + ' ' + getCuisine(suggestion.key).toLowerCase()}
              suggestions={suggestion.recipes}
            />
          ))}
      </>
    );
  };

  const renderSearchResults = () => {
    return (
      <>
        {searchData?.getSearchResults?.tags?.length > 0 && (
          <SuggestionCategoryComponent
            title={i18next.t('suggestions:searchFilterResults')}
            suggestions={[...searchData?.getSearchResults?.tags]}
          />
        )}
        {searchData?.getSearchResults?.text?.length > 0 && (
          <SuggestionCategoryComponent
            title={i18next.t('suggestions:searchResults')}
            suggestions={[...searchData?.getSearchResults?.text]}
          />
        )}
      </>
    );
  };

  return (
    <>
      <ScreenBackground>
        <Header title={i18next.t(`recipes:title`)} />
        {isRefreshing && <LoadingAnimation lottieViewRef={lottieViewRef} top={40} />}
        <ScrollView
          keyboardShouldPersistTaps="handled"
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
          <SearchComponent
            text={text}
            onChangeText={setText}
            search={search}
            categoryTags={categoryTags}
            setCategoryTags={setCategoryTags}
            cuisineTags={cuisineTags}
            setCuisineTags={setCuisineTags}
            dishTags={dishTags}
            setDishTags={setDishTags}
            setSearchIsActive={setSearchIsActive}
          />

          {searchIsActive ? renderSearchResults() : renderSuggestions()}
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
