import i18next from 'i18next';
import { Menu } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { EditModalTypes } from './EditModal';
import { StyleSheet } from 'react-native';
import { Recipe } from '../../types/recipe';
import { useAuthMutation } from '../../hooks/useAuthMutation';
import { ADD_LIST } from '../../api/mutations';
import { addReminder } from '../../nativeModules/ReminderModule';

type Props = {
  recipe: Recipe;
  setOpenEditModal: (value: boolean) => void;
  setEditModalType: (value: EditModalTypes | undefined) => void;
  setEditValue: (value: string) => void;
  setOpenMenu: (open: boolean) => void;
  openMenu: boolean;
  setOpenFolderModal: (open: boolean) => void;
};

export const RecipeDetailsHeaderMenu: React.FC<Props> = ({
  recipe,
  setOpenMenu,
  openMenu,
  setOpenEditModal,
  setEditModalType,
  setEditValue,
  setOpenFolderModal,
}) => {
  const [addToList] = useAuthMutation(ADD_LIST);

  const addToShoppingList = async () => {
    let reminders: any = [];
    try {
      await Promise.all(
        recipe.ingredients.map(async (ingredient) => {
          reminders.push({ id: (await addReminder(ingredient))?.id, ingredient });
        }),
      );
    } catch (error) {
      console.log('error', error);
    }

    console.log('reminders', reminders);

    reminders.map(async (reminder: any) => {
      await addToList({
        variables: {
          name: reminder?.ingredient,
          amount: '',
          id: reminder?.id || undefined,
        },
      });
    });
    setOpenMenu(false);
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
      default:
        setEditModalType(undefined);
        break;
    }
  };

  const setOpenMenuAndEdit = (type: EditModalTypes) => {
    setOpenMenu(false);
    onOpenEditModal(type);
  };

  return (
    <Menu
      contentStyle={styles.menu}
      visible={openMenu}
      onDismiss={() => {
        setOpenMenu(false);
        onOpenEditModal(undefined);
      }}
      anchor={
        <MaterialCommunityIcons
          name="dots-vertical"
          color={Colors.beige}
          size={28}
          onPress={() => setOpenMenu(!openMenu)}
        />
      }
    >
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          setOpenMenuAndEdit(EditModalTypes.title);
        }}
        title={i18next.t('recipeDetails:editTitle')}
      />
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          setOpenMenuAndEdit(EditModalTypes.category);
        }}
        title={i18next.t('recipeDetails:editCategory')}
      />
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          setOpenMenuAndEdit(EditModalTypes.cuisine);
        }}
        title={i18next.t('recipeDetails:editCuisine')}
      />
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          setOpenFolderModal(true);
        }}
        title={i18next.t('recipeDetails:addToFolder')}
      />
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          addToShoppingList();
        }}
        title={i18next.t('recipeDetails:addToShoppingList')}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: Colors.beige,
    paddingVertical: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
