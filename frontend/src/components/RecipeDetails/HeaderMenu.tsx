import i18next from 'i18next';
import { Menu } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { EditModalTypes } from './EditModal';
import { StyleSheet } from 'react-native';

type Props = {
  setOpenMenu: (open: boolean) => void;
  openMenu: boolean;
  onOpenEditModal: (editModalType: EditModalTypes | undefined) => void;
  setOpenMenuAndEdit: (editModalType: EditModalTypes) => void;
  setOpenFolderModal: (open: boolean) => void;
};

export const HeaderMenu: React.FC<Props> = (props) => {
  return (
    <Menu
      contentStyle={styles.menu}
      visible={props.openMenu}
      onDismiss={() => {
        props.setOpenMenu(false);
        props.onOpenEditModal(undefined);
      }}
      anchor={
        <MaterialCommunityIcons
          name="dots-vertical"
          color={Colors.beige}
          size={28}
          onPress={() => props.setOpenMenu(!props.openMenu)}
        />
      }
    >
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          props.setOpenMenuAndEdit(EditModalTypes.title);
        }}
        title={i18next.t('recipeDetails:editTitle')}
      />
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          props.setOpenMenuAndEdit(EditModalTypes.category);
        }}
        title={i18next.t('recipeDetails:editCategory')}
      />
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          props.setOpenMenuAndEdit(EditModalTypes.cuisine);
        }}
        title={i18next.t('recipeDetails:editCuisine')}
      />
      <Menu.Item
        style={styles.menu}
        onPress={() => {
          props.setOpenFolderModal(true);
        }}
        title={i18next.t('recipeDetails:addToFolder')}
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
