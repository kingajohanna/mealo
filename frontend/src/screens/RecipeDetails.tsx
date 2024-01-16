import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, Pressable } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Colors } from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { CheckableText } from '../components/CheckableText';
import { List, TextInput, ToggleButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import { Header } from '../components/Header';
import { Tabs } from '../navigation/tabs';
import { EDIT_RECIPE, FAVORITE_RECIPE, FOLDER_RECIPE, SHARE_RECIPE } from '../api/mutations';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { Button } from '../components/Button';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { GET_RECIPES } from '../api/queries';
import i18next from 'i18next';
import { ShareModal } from '../components/RecipeDetails/ShareModal';
import { EditModal, EditModalTypes } from '../components/RecipeDetails/EditModal';
import { FolderModal } from '../components/RecipeDetails/FolderModal';
import { InfoBubbles } from '../components/RecipeDetails/InfoBubbles';
import { HeaderMenu } from '../components/RecipeDetails/HeaderMenu';

const { width } = Dimensions.get('window');

type Props = StackScreenProps<RecipeStackParamList, Tabs.RECIPE>;

export const RecipeDetails: React.FC<Props> = ({ route, navigation }) => {
  const [data, refetch] = useAuthQuery(GET_RECIPES);

  const [editRecipe, edit_data] = useAuthMutation(EDIT_RECIPE);
  const [editFolders, folder_data] = useAuthMutation(FOLDER_RECIPE);
  const [editFavoriteRecipe, fav_data] = useAuthMutation(FAVORITE_RECIPE);
  const [share] = useAuthMutation(SHARE_RECIPE);
  const [recipe, setRecipe] = useState(route.params.recipe);
  const [openIngredients, setOpenIngredients] = useState(true);
  const [openInstructions, setOpenInstructions] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [editModalType, setEditModalType] = useState<EditModalTypes>();
  const [editValue, setEditValue] = useState('');
  const [yields, setYields] = useState(recipe.yields || '1 serving');

  const initialFolderValues = Object.fromEntries(
    data?.getRecipes.folders
      .map((folder: string) => [folder, recipe.folders?.includes(folder) ? true : false])
      .sort((a: [string, boolean], b: [string, boolean]) => a[0].localeCompare(b[0])),
  );
  const [folderValues, setFolderValues] = useState(initialFolderValues);

  useEffect(() => {
    if (edit_data?.editRecipe) {
      setRecipe(edit_data.editRecipe);
    }
  }, [edit_data]);

  useEffect(() => {
    if (folder_data?.folderRecipe) {
      setRecipe(folder_data.folderRecipe);
    }
  }, [folder_data]);

  useEffect(() => {
    if (fav_data?.favorite_recipe) {
      setRecipe(fav_data.favoriteRecipe);
    }
  }, [fav_data]);

  useEffect(() => {
    setFolderValues(initialFolderValues);
  }, [data.getRecipes.folders]);

  const favHandler = () => {
    setRecipe({ ...recipe, is_favorite: !recipe.is_favorite });
    editFavoriteRecipe({
      variables: { recipeId: recipe.id },
    });
  };

  const onOpenEditModal = (type: EditModalTypes | undefined) => {
    setOpenEditModal(type !== undefined);
    setEditModalType(type);
    switch (type) {
      case EditModalTypes.title:
        setEditValue(recipe.title || '');
        break;
      case EditModalTypes.category:
        setEditValue(recipe.category || '');
        break;
      case EditModalTypes.cuisine:
        setEditValue(recipe.cuisine || '');
        break;
      case EditModalTypes.time:
        setEditValue(recipe.totalTime || '');
        break;
      case EditModalTypes.rating:
        setEditValue(recipe.ratings || '');
        break;
      case EditModalTypes.calories:
        setEditValue(recipe.calories || '');
        break;
      case EditModalTypes.difficulty:
        setEditValue(recipe.difficulty || '');
        break;
      case EditModalTypes.yields:
        setEditValue(recipe.yields || '');
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
      case EditModalTypes.rating:
        return {
          ratings: editValue,
        };
      case EditModalTypes.calories:
        return {
          calories: editValue,
        };
      case EditModalTypes.difficulty:
        return {
          difficulty: editValue,
        };
      case EditModalTypes.yields:
        return {
          yields: editValue,
        };
      default:
        break;
    }
    return;
  };

  const setOpenMenuAndEdit = (type: EditModalTypes) => {
    setOpenMenu(false);
    onOpenEditModal(type);
  };

  const handleSwitchChange = (folder: string) => {
    setFolderValues((prevValues: any) => ({
      ...prevValues,
      [folder]: !prevValues[folder],
    }));
  };

  const increaseServings = () => {
    const firstWord = yields.split(' ')[0];
    if (/^\d+$/.test(firstWord)) {
      const newServings = parseFloat(firstWord) + 1;

      const ratio = newServings / parseFloat(firstWord);

      setYields(`${newServings} servings`);

      const newIngredients = recipe.ingredients.map((ingredient: string) => {
        const firstWord = ingredient.split(' ')[0];
        if (/^\d+(\.\d+)?$/.test(firstWord)) {
          const newAmount = Math.round(parseFloat(firstWord) * ratio * 100) / 100;
          return newAmount.toString() + ' ' + ingredient.split(' ')?.slice(1, undefined)?.join(' ');
        }
        return ingredient;
      });

      setRecipe({ ...recipe, ingredients: newIngredients });
    }
  };

  const decreaseServings = () => {
    const firstWord = yields.split(' ')[0];
    if (/^\d+$/.test(firstWord)) {
      if (parseFloat(firstWord) === 1) return;

      const newServings = parseFloat(firstWord) - 1;

      const ratio = newServings / parseFloat(firstWord);
      console.log(ratio);

      setYields(`${newServings} servings`);

      const newIngredients = recipe.ingredients.map((ingredient: string) => {
        const firstWord = ingredient.split(' ')[0];
        if (/^\d+(\.\d+)?$/.test(firstWord)) {
          console.log(parseFloat(firstWord));

          const newAmount = Math.round(parseFloat(firstWord) * ratio * 100) / 100;
          console.log('n', newAmount);

          return newAmount.toString() + ' ' + ingredient.split(' ')?.slice(1, undefined)?.join(' ');
        }
        return ingredient;
      });

      setRecipe({ ...recipe, ingredients: newIngredients });
    }
  };

  return (
    <ScreenBackground fullscreen>
      <Header
        title={recipe.title}
        rightAction={
          <HeaderMenu
            setOpenMenu={setOpenMenu}
            openMenu={openMenu}
            onOpenEditModal={onOpenEditModal}
            setOpenMenuAndEdit={setOpenMenuAndEdit}
            setOpenFolderModal={setOpenFolderModal}
          />
        }
        leftAction={
          <SimpleLineIcons name="arrow-left" size={25} color={Colors.beige} onPress={() => navigation.goBack()} />
        }
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View>
          <FastImage
            style={{ height: 300 }}
            source={{
              uri: recipe.image,
              priority: FastImage.priority.normal,
            }}
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.contentContainer}>
          <InfoBubbles recipe={recipe} setOpenMenuAndEdit={setOpenMenuAndEdit} />
          <View style={styles.siteDataContainer}>
            <Pressable style={styles.rowContainer} onPress={() => setOpenShareModal(true)}>
              <IonIcon
                name={Platform.OS === 'android' ? 'share-social' : 'share-outline'}
                color={Colors.pine}
                size={28}
              />
              <Text style={styles.siteText}>{i18next.t('recipeDetails:share')}</Text>
            </Pressable>
            <View style={styles.rowContainer}>
              <MaterialCommunityIcons name="web" color={Colors.pine} size={28} />
              <Text style={styles.siteText}>{recipe.siteName}</Text>
            </View>
          </View>
          <View style={styles.servingContainer}>
            <ToggleButton.Row onValueChange={() => {}} value={''}>
              <ToggleButton
                icon="minus"
                value="accept"
                onPress={() => {
                  decreaseServings();
                }}
                iconColor={Colors.salmon}
                rippleColor={Colors.salmonOp}
                style={styles.toggleButtonStyle}
              />
              <TextInput label={yields} disabled mode="outlined" style={{ backgroundColor: Colors.beige }} />
              <ToggleButton
                icon="plus"
                value="cancel"
                onPress={() => {
                  increaseServings();
                }}
                iconColor={Colors.salmon}
                rippleColor={Colors.salmonOp}
                style={styles.toggleButtonStyle}
              />
            </ToggleButton.Row>
          </View>

          <View style={styles.listBorder}>
            <List.Accordion
              theme={{ colors: { background: 'transparent', text: Colors.pine } }}
              style={styles.listAccordion}
              title={i18next.t('recipeDetails:ingredients')}
              left={() => (
                <MaterialCommunityIcons name="chef-hat" color={Colors.pine} size={24} style={styles.listIcon} />
              )}
              id="1"
              expanded={openIngredients}
              onPress={() => setOpenIngredients(!openIngredients)}
              titleStyle={styles.listAccordionTitle}
            >
              <View style={styles.ingredientsContainer}>
                {recipe.ingredients.map((ingredient: string, index: number) => {
                  return (
                    <CheckableText checkedStyle={styles.checkedText} key={'ingredient' + index} style={styles.text}>
                      <Text style={styles.text}>• </Text>
                      <Text style={styles.text}>{ingredient}</Text>
                    </CheckableText>
                  );
                })}
              </View>
            </List.Accordion>
          </View>

          <View style={styles.listBorder}>
            <List.Accordion
              theme={{ colors: { background: 'transparent', text: Colors.pine } }}
              style={styles.listAccordion}
              title={i18next.t('recipeDetails:instructions')}
              left={() => <MaterialCommunityIcons name="knife" color={Colors.pine} size={24} style={styles.listIcon} />}
              id="1"
              expanded={openInstructions}
              onPress={() => setOpenInstructions(!openInstructions)}
              titleStyle={styles.listAccordionTitle}
            >
              <View style={styles.ingredientsContainer}>
                {recipe.instructions.map((instruction: string, index: number) => {
                  return (
                    <View key={instruction + index} style={{ paddingRight: 8 }}>
                      <Text style={styles.textMedium}>
                        {index + 1} {i18next.t('recipeDetails:step')}{' '}
                      </Text>
                      <View style={styles.ingredientsListContainer}>
                        <View style={styles.verticalLine} />
                        <Text style={styles.text} key={'instruction' + index}>
                          {instruction}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </List.Accordion>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          icon={<IonIcon name={recipe.is_favorite ? 'heart' : 'heart-outline'} color={Colors.grey} size={32} />}
          style={[styles.smallButton, { borderColor: Colors.grey }]}
          onPress={favHandler}
        />
        <Button
          icon={<IonIcon name="play" color={Colors.pine} size={32} />}
          style={[styles.smallButton, { borderColor: Colors.pine }]}
        />
        <Button
          title={i18next.t('recipeDetails:startCooking')}
          titleStyle={[styles.textMedium, { color: Colors.beige, textAlign: 'center' }]}
          style={styles.cookButton}
          onPress={() => navigation.navigate(Tabs.COOKINGMODE, { recipe })}
        />
      </View>

      <FolderModal
        isOpen={openFolderModal}
        editValue={editValue}
        setEditValue={setEditValue}
        onCancel={() => {
          setOpenFolderModal(false);
          setEditValue('');
        }}
        onEdit={async () => {
          setOpenFolderModal(false);
          const trueFolders = Object.keys(folderValues).filter((folder) => folderValues[folder]);
          if (editValue !== '') trueFolders.push(editValue);
          await editFolders({
            variables: {
              recipeId: recipe.id,
              folders: trueFolders,
            },
          });
          setEditValue('');
          refetch();
        }}
        folderValues={folderValues}
        handleSwitchChange={handleSwitchChange}
      />
      <EditModal
        isOpen={openEditModal}
        editValue={editValue}
        setEditValue={setEditValue}
        editModalType={editModalType}
        onCancel={() => {
          setOpenEditModal(false);
        }}
        onEdit={async () => {
          setOpenEditModal(false);
          editRecipe({
            variables: { recipeId: recipe.id, body: getEditContent() },
          });
        }}
      />
      <ShareModal
        isOpen={openShareModal}
        editValue={editValue}
        setEditValue={setEditValue}
        onShare={async () => {
          setOpenShareModal(false);
          share({
            variables: { recipeId: recipe.id, email: editValue.toLowerCase() },
          });
          setEditValue('');
        }}
        onCancel={() => {
          setEditValue('');
          setOpenShareModal(false);
        }}
      />
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    lineHeight: 56,
    color: Colors.pine,
    paddingLeft: 15,
  },
  textMedium: {
    fontSize: 18,
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 20,
    color: Colors.textDark,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.3,
  },
  ingredientsListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  listBorder: {
    borderWidth: 2,
    borderRadius: 15,
    paddingBottom: 5,
    marginTop: 10,
    borderColor: Colors.grey,
  },
  listIcon: {
    paddingLeft: 12,
    paddingTop: 6,
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
  servingContainer: {
    alignSelf: 'center',
  },
  toggleButtonStyle: {
    height: 50,
    marginTop: 6,
    marginLeft: -1,
    backgroundColor: Colors.salmonOp,
  },
  ingredientsContainer: {
    backgroundColor: Colors.beige,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 16,
    borderTopWidth: 2,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    borderTopColor: Colors.grey,
  },

  scrollView: {
    width: '100%',
  },
  cookButton: {
    borderWidth: 2,
    backgroundColor: Colors.pine,
    borderColor: Colors.pine,
    width: width - 54 - 54 - 60,
  },
  siteDataContainer: {
    paddingLeft: 12,
    paddingTop: 24,
  },
  siteText: {
    paddingLeft: 12,
    fontSize: 16,
    color: Colors.pine,
  },
  smallButton: {
    borderWidth: 2,
    width: 54,
    paddingHorizontal: 0,
    justifyContent: 'center',
    marginRight: 8,
  },
  contentContainer: {
    backgroundColor: Colors.beige,
    marginTop: -50,
    padding: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  listAccordion: {
    backgroundColor: 'transparent',
  },
  listAccordionTitle: {
    color: Colors.pine,
    fontSize: 18,
    alignItems: 'center',
  },
  instructionContainer: {
    backgroundColor: Colors.beige,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    height: '95%',
    width: 3,
    backgroundColor: Colors.grey,
  },
});
