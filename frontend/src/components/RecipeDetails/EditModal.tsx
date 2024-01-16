import i18next from 'i18next';
import React from 'react';
import Dialog from 'react-native-dialog';

type Props = {
  isOpen: boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  onCancel: () => void;
  onEdit: () => void;
  editModalType: EditModalTypes | undefined;
};

export enum EditModalTypes {
  title = 'title',
  category = 'category',
  time = 'total time',
  cuisine = 'cuisine',
  rating = 'rating',
  calories = 'calories',
  difficulty = 'difficulty',
  yields = 'yields',
}

export const EditModal: React.FC<Props> = (props) => {
  const getEditModalTitle = () => {
    switch (props.editModalType) {
      case EditModalTypes.category:
        return i18next.t('recipeDetails:editCategory');
      case EditModalTypes.title:
        return i18next.t('recipeDetails:editTitle');
      case EditModalTypes.time:
        return i18next.t('recipeDetails:editTotalTime');
      case EditModalTypes.cuisine:
        return i18next.t('recipeDetails:editCuisine');
      case EditModalTypes.rating:
        return i18next.t('recipeDetails:editRating');
      case EditModalTypes.calories:
        return i18next.t('recipeDetails:editCalories');
      case EditModalTypes.difficulty:
        return i18next.t('recipeDetails:editDifficulty');
      case EditModalTypes.yields:
        return i18next.t('recipeDetails:editYields');
      default:
        break;
    }
  };

  return (
    <Dialog.Container visible={props.isOpen}>
      <Dialog.Title>{getEditModalTitle()}</Dialog.Title>
      <Dialog.Input
        placeholder={props.editModalType}
        value={props.editValue}
        onChangeText={(text) => props.setEditValue(text)}
      />
      <Dialog.Button label={i18next.t('general:cancel')} onPress={props.onCancel} />
      <Dialog.Button label={i18next.t('general:change')} onPress={props.onEdit} />
    </Dialog.Container>
  );
};
