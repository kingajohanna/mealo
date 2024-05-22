import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { AppNav } from '../navigation/tabs';
import { Recipe } from '../types/recipe';
import LottieView from 'lottie-react-native';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { Colors } from '../theme/colors';
import FastImage from 'react-native-fast-image';
import i18next from 'i18next';
import { TextInput } from '../components/TextInput';
import { useEffect, useRef, useState } from 'react';
import { SearchModal } from '../components/SearchModal';
import { FAB } from 'react-native-paper';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Time } from './Recipes';
import { RecipeList } from '../components/Recipes/RecipeList';
import { useStore } from '../stores';
import { observer } from 'mobx-react-lite';

const { width } = Dimensions.get('window');
const gap = 5;
const refreshingHeight = 130;

export const all = i18next.t(`recipes:all`);

export const FolderScreen = observer(() => {
  const { userStore } = useStore();

  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const lottieViewRef = useRef<LottieView>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [folders, setFolders] = useState<string[]>(data?.getRecipes.folders);
  const [filteredRecipes, setFilteredRecipes] = useState(data?.getRecipes.recipes);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(all);
  const [cuisine, setCuisine] = useState(all);
  const [time, setTime] = useState<Time | undefined>(undefined);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();
  const accessPage = (recipe: Recipe) => navigation.navigate(AppNav.RECIPE, { recipe });

  const filterActive = category !== all || cuisine !== all || text !== '' || time !== undefined;

  const reset = () => {
    setText('');
    setCategory(all);
    setCuisine(all);
    setTime(undefined);
    setFilteredRecipes(data?.getRecipes.recipes);
  };

  useEffect(() => {
    if (data?.getRecipes.recipes.length === 0) {
      return;
    }

    if (
      category === i18next.t(`recipes:all`) &&
      cuisine === i18next.t(`recipes:all`) &&
      text === '' &&
      time === undefined
    ) {
      return setFilteredRecipes(data?.getRecipes.recipes);
    }

    const keys: string[] = [];
    const values: string[] = [];

    if (category !== all) {
      keys.push('category');
      values.push(category);
    }

    if (cuisine !== all) {
      keys.push('cuisine');
      values.push(cuisine);
    }

    if (text) {
      keys.push('title');
      values.push(text);
    }

    if (time) {
      keys.push('speed');
      values.push(time);
    }

    const filter = (recipe: Recipe) => {
      return keys.every((key, i) => {
        const value = recipe[key];
        return typeof value === 'string' && value.toLowerCase().includes(values[i].toLowerCase());
      });
    };

    const filteredRecipes = data?.getRecipes.recipes.filter(filter);

    return setFilteredRecipes(filteredRecipes);
  }, [text, category, cuisine, time]);

  useEffect(() => {
    if (data?.getRecipes.folders) {
      let folders = [
        i18next.t('folders:all'),
        i18next.t('folders:favorites'),
        ...data?.getRecipes.folders.filter((folder: string) => folder.toLowerCase().includes(searchText.toLowerCase())),
      ];

      if (userStore.showCuisineFolders) {
        folders = [
          ...folders,
          ...data?.getRecipes.cuisines.filter((cuisine: string) =>
            cuisine.toLowerCase().includes(searchText.toLowerCase()),
          ),
        ];
      }
      if (userStore.showCategoryFolders) {
        folders = [
          ...folders,
          ...data?.getRecipes.categories.filter((categories: string) =>
            categories.toLowerCase().includes(searchText.toLowerCase()),
          ),
        ];
      }

      setFolders(folders);
    }
  }, [searchText, data, userStore.showCuisineFolders, userStore.showCategoryFolders]);

  const renderImage = (position: number, image: string, lenght?: number) => {
    const getRadius = () => {
      switch (position) {
        case 1:
          return { borderTopLeftRadius: 15 };
        case 2:
          return { borderTopRightRadius: 15 };
        case 3:
          return { borderBottomLeftRadius: 15 };
        case 4:
          return { borderBottomRightRadius: 15 };
        default:
          return {};
      }
    };

    if (position === 4 && lenght && lenght > 4)
      return (
        <View style={styles.backgroundImage}>
          <Text>{lenght - 3} more...</Text>
        </View>
      );

    return (
      <FastImage
        style={[styles.backgroundImage, getRadius()]}
        source={{
          uri: image,
          priority: FastImage.priority.high,
        }}
      />
    );
  };

  const renderFolder = (filter: string) => {
    let recipes: Recipe[] = [];
    switch (filter) {
      case i18next.t('folders:all'):
        recipes = data?.getRecipes.recipes;
        break;
      case i18next.t('folders:favorites'):
        recipes = data?.getRecipes.recipes.filter((recipe: Recipe) => recipe.is_favorite);
        break;
      default:
        recipes = data?.getRecipes.recipes.filter(
          (recipe: Recipe) =>
            recipe.category === filter || recipe.cuisine === filter || recipe.folders?.includes(filter),
        );
        break;
    }

    return (
      <Pressable style={styles.gridItem} onPress={() => navigation.navigate(AppNav.RECIPEFOLDER, { filter, recipes })}>
        <View style={{ flexDirection: 'row' }}>
          {renderImage(1, recipes[0]?.image || '')}
          {renderImage(2, recipes[1]?.image || '')}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {renderImage(3, recipes[2]?.image || '')}
          {renderImage(4, recipes[3]?.image || '', recipes.length)}
        </View>
        <View style={styles.overlay} />
        <Text
          style={{
            position: 'absolute',
            alignSelf: 'center',
            opacity: 1,
            color: Colors.textLight,
            fontSize: 24,
            fontWeight: '400',
          }}
        >
          {filter}
        </Text>
      </Pressable>
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
        top: 10,
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
      <ScreenBackground>
        <Header title={i18next.t('folders:title')} />
        <View style={styles.container}>
          {filterActive ? (
            <RecipeList data={filteredRecipes} onPress={accessPage} />
          ) : (
            <>
              <TextInput
                onChangeText={setSearchText}
                text={searchText}
                placeholder={i18next.t(`folders:searchPlaceholder`)}
              />
              {loadingAnimation}
              <FlatList
                data={folders}
                numColumns={2}
                keyExtractor={(item) => item}
                renderItem={({ item }) => renderFolder(item)}
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
          )}
        </View>
        <SearchModal
          refRBSheet={bottomSheetModalRef}
          onChangeText={setText}
          text={text}
          time={time}
          setTime={setTime}
          category={category}
          setCategory={setCategory}
          cuisine={cuisine}
          setCuisine={setCuisine}
          reset={reset}
          search={() => bottomSheetModalRef.current?.dismiss()}
        />
      </ScreenBackground>
      <FAB
        icon="magnify"
        color={Colors.textLight}
        style={styles.fab}
        onPress={() => bottomSheetModalRef.current?.present()}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 5,
    paddingBottom: 30,
    width: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 8,
    right: 0,
    top: 75,
    zIndex: 1,
    borderRadius: 30,
  },
  gridItem: {
    width: width / 2 - 2 * gap - 10,
    aspectRatio: 1,

    margin: gap,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  backgroundImage: {
    flex: 1,
    aspectRatio: 1,
    width: (width / 2 - 2 * gap - 10) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    borderRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
