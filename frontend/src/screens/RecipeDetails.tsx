import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { ScreenBackground } from '../components/Background';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Colors } from '../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import { Header } from '../components/Header';
import { Tabs } from '../navigation/tabs';
import { EDIT_RECIPE, FOLDER_RECIPE, SAVE_RECIPE, SHARE_RECIPE } from '../api/mutations';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { GET_RECIPES } from '../api/queries';
import { ShareModal } from '../components/RecipeDetails/ShareModal';
import { EditModal, EditModalTypes } from '../components/RecipeDetails/EditModal';
import { FolderModal } from '../components/RecipeDetails/FolderModal';
import { InfoBubbles } from '../components/RecipeDetails/InfoBubbles';
import { RecipeDetailsHeaderMenu } from '../components/RecipeDetails/RecipeDetailsHeaderMenu';
import { BottomButtonContainer } from '../components/RecipeDetails/BottomButtonContainer';
import { DescriptionComponent } from '../components/RecipeDetails/DescriptionComponent';
import { IngredientsComponent } from '../components/RecipeDetails/IngredientsComponent';
import { InstructionsComponent } from '../components/RecipeDetails/InstructionsComponent';
import { OtherActionContainer } from '../components/RecipeDetails/OtherActionContainer';
import { Recipe } from '../types/recipe';
import { removeFields } from '../utils/removeFields';

type Props = StackScreenProps<RecipeStackParamList, Tabs.RECIPE>;

export const RecipeDetails: React.FC<Props> = ({ route, navigation }) => {
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const [editRecipe, edit_data] = useAuthMutation(EDIT_RECIPE);
  const [saveRecipe, save_data] = useAuthMutation(SAVE_RECIPE);
  const [editFolders, folder_data] = useAuthMutation(FOLDER_RECIPE);
  const [share] = useAuthMutation(SHARE_RECIPE);

  const [recipe, setRecipe] = useState(route.params.recipe);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [editModalType, setEditModalType] = useState<EditModalTypes>();
  const [editValue, setEditValue] = useState('');

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
    setFolderValues(initialFolderValues);
  }, [data.getRecipes.folders]);

  useEffect(() => {
    const r = data?.getRecipes?.recipes?.find((r: Recipe) => r?.canonical_url === recipe?.canonical_url);

    if (r) setRecipe(r);
  }, [data?.getRecipes]);

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

  const handleSwitchChange = (folder: string) => {
    setFolderValues((prevValues: any) => ({
      ...prevValues,
      [folder]: !prevValues[folder],
    }));
  };

  const onSaveRecipe = async () => {
    const unnecessaryFields = ['__typename', '_id', 'id'];

    removeFields(recipe, unnecessaryFields);

    const addedRecipe = await saveRecipe({
      variables: {
        recipe: recipe,
      },
    });
    refetch();
    setRecipe(addedRecipe?.data?.saveRecipe);
  };

  return (
    <ScreenBackground fullscreen>
      <Header
        title={recipe.title}
        rightAction={
          recipe.id ? (
            <RecipeDetailsHeaderMenu
              setOpenMenu={setOpenMenu}
              openMenu={openMenu}
              setOpenFolderModal={setOpenFolderModal}
              recipe={recipe}
              setOpenEditModal={setOpenEditModal}
              setEditModalType={setEditModalType}
              setEditValue={setEditValue}
            />
          ) : (
            <IonIcon name="add-outline" size={48} color={Colors.salmon} onPress={onSaveRecipe} />
          )
        }
        leftAction={
          <SimpleLineIcons name="arrow-left" size={25} color={Colors.beige} onPress={() => navigation.goBack()} />
        }
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View>
          <FastImage
            style={{ height: 300, width: '100%' }}
            source={{
              uri: recipe.image,
              priority: FastImage.priority.high,
            }}
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.contentContainer}>
          <InfoBubbles
            recipe={recipe}
            setEditModalType={setEditModalType}
            setEditValue={setEditValue}
            setOpenEditModal={setOpenEditModal}
          />

          <OtherActionContainer recipe={recipe} setRecipe={setRecipe} setOpenShareModal={setOpenShareModal} />

          {recipe.description && <DescriptionComponent description={recipe.description} recipeId={recipe.id} />}

          {recipe.ingredients.length > 0 && <IngredientsComponent ingredients={recipe.ingredients} />}

          {recipe.instructions.length > 0 && <InstructionsComponent instructions={recipe.instructions} />}
        </View>
      </ScrollView>

      <BottomButtonContainer recipe={recipe} setRecipe={setRecipe} navigation={navigation} route={route} />

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
          setEditValue('');
        }}
        onEdit={async () => {
          setOpenEditModal(false);
          setEditValue('');
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
  title: {
    fontSize: 18,
    lineHeight: 56,
    color: Colors.pine,
    paddingLeft: 15,
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

  scrollView: {
    width: '100%',
  },

  contentContainer: {
    backgroundColor: Colors.beige,
    marginTop: -50,
    padding: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
