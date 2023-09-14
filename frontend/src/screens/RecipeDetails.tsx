import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import {ScreenBackground} from '../components/Background';
import {RecipeStackParamList} from '../navigation/AppNavigator';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors} from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Ingredients} from '../components/Ingredients';
import {List, Menu} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Dots from 'react-native-dots-pagination';
import Dialog from 'react-native-dialog';
import FastImage from 'react-native-fast-image';
import {useStore} from '../stores';
import {Header} from '../components/Header';
import {Tabs} from '../navigation/tabs';
import {useMutation} from '@apollo/client';
import {EDIT_RECIPE} from '../api/queries';

const {width} = Dimensions.get('window');

type Props = StackScreenProps<RecipeStackParamList, Tabs.RECIPE>;

enum EditModalTypes {
  title = 'title',
  category = 'category',
  time = 'total time',
  cuisine = 'cuisine',
}

export const RecipeDetails: React.FC<Props> = ({route, navigation}) => {
  const {recipeStore} = useStore();
  const {recipe} = route.params;

  const [editRecipe, {data}] = useMutation(EDIT_RECIPE);

  const [showedRecipe, setShowedRecipe] = useState(recipe);

  const [openIngredients, setOpenIngredients] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [editModalType, setEditModalType] = useState<EditModalTypes>();
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (data?.editRecipe) {
      setShowedRecipe(data?.editRecipe);
    }
  }, [data]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      setActiveDot(roundIndex);
    },
    [],
  );

  /*useEffect(() => {
    if (instructions[instructions.length - 3]?.includes('Ha tetszett')) {
      setInstructions(instructions.slice(0, instructions.length - 3));
    }
  });*/

  const openEditModal = (type: EditModalTypes | undefined) => {
    switch (type) {
      case EditModalTypes.title:
        setEditValue(showedRecipe.title || '');
        setEditModalType(type);
        break;
      case EditModalTypes.category:
        setEditValue(showedRecipe.category || '');
        setEditModalType(type);
        break;
      case EditModalTypes.cuisine:
        setEditValue(showedRecipe.cuisine || '');
        setEditModalType(type);
        break;
      case EditModalTypes.time:
        setEditValue(showedRecipe.totalTime || '');
        setEditModalType(type);
        break;
      default:
        setEditModalType(undefined);
        break;
    }
  };

  const getEditContent = () => {
    switch (editModalType) {
      case EditModalTypes.category:
        return {
          category: editValue,
        };
      case EditModalTypes.title:
        return {
          title: editValue,
        };
      case EditModalTypes.time:
        return {
          totalTime: editValue,
        };
      case EditModalTypes.cuisine:
        return {
          cuisine: editValue,
        };
      default:
        break;
    }
    return;
  };

  const MenuItem = ({onPress, title}: {onPress: () => void; title: string}) => (
    <Menu.Item onPress={onPress} style={styles.menu} title={title} />
  );

  const setOpenMenuAndEdit = (type: EditModalTypes) => {
    setOpenMenu(false);
    openEditModal(type);
  };

  const renderMenu = (
    <Menu
      contentStyle={styles.menu}
      visible={openMenu}
      onDismiss={() => {
        setOpenMenu(false);
        openEditModal(undefined);
      }}
      anchor={
        <MaterialCommunityIcons
          name="dots-vertical"
          color={Colors.beige}
          size={28}
          onPress={() => setOpenMenu(!openMenu)}
        />
      }>
      <MenuItem
        onPress={() => {
          setOpenMenuAndEdit(EditModalTypes.title);
        }}
        title="Edit title"
      />
      <MenuItem
        onPress={() => {
          setOpenMenuAndEdit(EditModalTypes.category);
        }}
        title="Edit category"
      />
      <MenuItem
        onPress={() => {
          setOpenMenuAndEdit(EditModalTypes.time);
        }}
        title="Edit total time"
      />
      <MenuItem
        onPress={() => {
          setOpenMenuAndEdit(EditModalTypes.cuisine);
        }}
        title="Edit cuisine"
      />
    </Menu>
  );

  const renderBack = (
    <SimpleLineIcons
      name="arrow-left"
      size={25}
      color={Colors.beige}
      onPress={() => navigation.goBack()}
    />
  );

  const renderImage = () => {
    return (
      <View>
        <FastImage
          style={{height: 250}}
          source={{
            uri: showedRecipe.image,
            priority: FastImage.priority.normal,
          }}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.textOverlay}>
          <View style={styles.timerIconStyle}>
            {showedRecipe.totalTime && (
              <View style={styles.timerRow}>
                <MaterialCommunityIcons
                  name="timer-outline"
                  color={Colors.textLight}
                  size={28}
                />

                <Text style={styles.timerText}>
                  {showedRecipe.totalTime} min
                </Text>
              </View>
            )}
            {showedRecipe.yields && (
              <View style={styles.timerRow}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../assets/images/yields.png')}
                />
                <Text style={styles.timerText}>{showedRecipe.yields}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenBackground>
      <Header title={showedRecipe.title} menu={renderMenu} back={renderBack} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {renderImage()}
        <View style={styles.contentContainer}>
          <List.Accordion
            theme={{colors: {background: 'transparent', text: Colors.pine}}}
            style={styles.listAccordion}
            title="Ingredients"
            id="1"
            expanded={openIngredients}
            onPress={() => setOpenIngredients(!openIngredients)}
            titleStyle={styles.listAccordionTitle}>
            <View style={styles.ingredientsContainer}>
              {showedRecipe.ingredients.map((ingredient, index) => {
                return (
                  <Ingredients key={'ingredient' + index} style={styles.text}>
                    <Text>{ingredient}</Text>
                  </Ingredients>
                );
              })}
            </View>
          </List.Accordion>

          <Text style={styles.title}>Instructions</Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            data={showedRecipe.instructions}
            onScroll={onScroll}
            renderItem={({item, index}) => (
              <View
                key={'instruction' + index}
                style={[styles.instructionContainer, {width: width - 20}]}>
                <Text style={styles.text} key={'instruction' + index}>
                  {item}
                </Text>
              </View>
            )}
          />
          <Dots
            length={showedRecipe.instructions.length}
            active={activeDot}
            activeColor={Colors.pine}
          />
        </View>
      </ScrollView>

      <Dialog.Container visible={editModalType !== undefined}>
        <Dialog.Title>Edit {editModalType}</Dialog.Title>
        <Dialog.Input
          placeholder={editModalType}
          value={editValue}
          onChangeText={text => setEditValue(text)}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setEditValue('');
            setEditModalType(undefined);
          }}
        />
        <Dialog.Button
          label="Change"
          onPress={async () => {
            editRecipe({
              variables: {recipeId: showedRecipe.id!, body: getEditContent()},
            });

            setEditValue('');
            setEditModalType(undefined);
          }}
        />
      </Dialog.Container>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    lineHeight: 56,
    color: Colors.pine,
    paddingLeft: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  textOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    bottom: 0,
    left: 20,
  },
  timerIconStyle: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'flex-start',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  timerText: {
    color: Colors.textLight,
    paddingLeft: 10,
    fontSize: 18,
  },
  ingredientsContainer: {
    backgroundColor: Colors.beige,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menu: {
    backgroundColor: Colors.beige,
    paddingVertical: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  scrollView: {
    width: '100%',
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 40,
  },
  listAccordion: {
    backgroundColor: 'transparent',
  },
  listAccordionTitle: {
    color: Colors.pine,
    fontSize: 18,
  },
  instructionContainer: {
    backgroundColor: Colors.beige,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
