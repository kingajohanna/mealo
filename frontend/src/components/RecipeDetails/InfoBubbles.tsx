import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RecipeDetailInfoBubble, RecipeDetailInfoBubbleType } from './RecipeDetailInfoBubble';
import { Recipe } from '../../types/recipe';
import { EditModalTypes } from './EditModal';

type Props = {
  recipe: Recipe;
  setOpenEditModal: (value: boolean) => void;
  setEditModalType: (value: EditModalTypes | undefined) => void;
  setEditValue: (value: string) => void;
};

export const InfoBubbles: React.FC<Props> = ({ recipe, setOpenEditModal, setEditModalType, setEditValue }) => {
  const onOpenEditModal = (type: EditModalTypes | undefined) => {
    setOpenEditModal(type !== undefined);
    setEditModalType(type);
    switch (type) {
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

  return (
    <View style={styles.infoBubbles}>
      <RecipeDetailInfoBubble
        data={recipe.ratings?.toString()}
        type={RecipeDetailInfoBubbleType.RATING}
        onLongPress={() => onOpenEditModal(EditModalTypes.rating)}
      />
      <RecipeDetailInfoBubble
        data={recipe.calories?.toString()}
        type={RecipeDetailInfoBubbleType.CALORIES}
        onLongPress={() => onOpenEditModal(EditModalTypes.calories)}
      />
      <RecipeDetailInfoBubble
        data={recipe.yields?.split(' ')[0].toString()}
        type={RecipeDetailInfoBubbleType.SERVING}
        onLongPress={() => onOpenEditModal(EditModalTypes.yields)}
      />
      <RecipeDetailInfoBubble
        data={recipe.difficulty?.toString()}
        type={RecipeDetailInfoBubbleType.DIFFICULTY}
        onLongPress={() => onOpenEditModal(EditModalTypes.difficulty)}
      />
      <RecipeDetailInfoBubble
        data={recipe.totalTime?.toString()}
        type={RecipeDetailInfoBubbleType.TIME}
        onLongPress={() => onOpenEditModal(EditModalTypes.time)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  infoBubbles: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
});
