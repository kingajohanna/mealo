import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { Recipe } from '../types/recipe';
import LottieView from 'lottie-react-native';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { Colors } from '../theme/colors';
import FastImage from 'react-native-fast-image';
import i18next from 'i18next';
import { TextInput } from '../components/TextInput';
import { useEffect, useRef, useState } from 'react';

const { width } = Dimensions.get('window');
const gap = 5;
const refreshingHeight = 130;

export const FolderScreen = () => {
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const lottieViewRef = useRef<LottieView>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [folders, setFolders] = useState<string[]>(data?.getRecipes.folders);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  useEffect(() => {
    if (data?.getRecipes.folders) {
      setFolders([
        i18next.t('folders:all'),
        i18next.t('folders:favorites'),
        ...data?.getRecipes.folders.filter((folder: string) => folder.toLowerCase().includes(searchText.toLowerCase())),
        ...data?.getRecipes.cuisines.filter((cuisine: string) =>
          cuisine.toLowerCase().includes(searchText.toLowerCase()),
        ),
        ...data?.getRecipes.categories.filter((categories: string) =>
          categories.toLowerCase().includes(searchText.toLowerCase()),
        ),
      ]);
    }
  }, [searchText, data]);

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
      <Pressable style={styles.gridItem} onPress={() => navigation.navigate(Tabs.RECIPEFOLDER, { filter, recipes })}>
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
        </View>
      </ScreenBackground>
    </>
  );
};

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
