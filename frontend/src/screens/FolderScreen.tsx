import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { Recipe } from '../types/recipe';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { Colors } from '../theme/colors';
import FastImage from 'react-native-fast-image';
import i18next from 'i18next';
import { TextInput } from '../components/TextInput';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');
const gap = 5;

export const FolderScreen = () => {
  const [refetch, data] = useAuthQuery(GET_RECIPES);
  const [searchText, setSearchText] = React.useState('');
  const [folders, setFolders] = React.useState<string[]>(data?.getRecipes.folders);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

 useEffect(() => {
    if (data?.getRecipes.folders) {
      setFolders(data?.getRecipes.folders.filter((folder: string) => folder.toLowerCase().includes(searchText.toLowerCase())));
    }
  }, [searchText]);

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
          priority: FastImage.priority.normal,
        }}
      />
    );
  };

  const renderFolder = (filter: string) => {
    const recipes = data?.getRecipes.recipes.filter((recipe: Recipe) => recipe.folders?.includes(filter));

    return (
      <Pressable style={styles.gridItem} onPress={() => navigation.navigate(Tabs.RECIPEFOLDER, { filter: filter })}>
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

  return (
    <>
      <ScreenBackground>
        <Header title={i18next.t('folders:title')} />
        <View style={{ marginTop: 30, flex: 1, padding: 5, paddingBottom: 30, width: '100%'}}>
          <TextInput onChangeText={setSearchText} text={searchText} placeholder={i18next.t(`folders:searchPlaceholder`)} />
          <FlatList
            data={folders}
            numColumns={2}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderFolder(item)}
          />
        </View>
      </ScreenBackground>
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
