import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RecipeDetailInfoBubble, RecipeDetailInfoBubbleType } from '../RecipeDetailInfoBubble';
import { Recipe } from '../../types/recipe';
import { EditModalTypes } from './EditModal';

type Props = {
  recipe: Recipe;
  setOpenMenuAndEdit: (editModalType: EditModalTypes) => void;
};

export const InfoBubbles: React.FC<Props> = ({ recipe, setOpenMenuAndEdit }) => {
  return (
    <View style={styles.infoBubbles}>
      <RecipeDetailInfoBubble
        data={recipe.ratings?.toString()}
        type={RecipeDetailInfoBubbleType.RATING}
        onLongPress={() => setOpenMenuAndEdit(EditModalTypes.rating)}
      />
      <RecipeDetailInfoBubble
        data={recipe.calories?.toString()}
        type={RecipeDetailInfoBubbleType.CALORIES}
        onLongPress={() => setOpenMenuAndEdit(EditModalTypes.calories)}
      />
      <RecipeDetailInfoBubble
        data={recipe.yields?.split(' ')[0].toString()}
        type={RecipeDetailInfoBubbleType.SERVING}
        onLongPress={() => setOpenMenuAndEdit(EditModalTypes.yields)}
      />
      <RecipeDetailInfoBubble
        data={recipe.difficulty?.toString()}
        type={RecipeDetailInfoBubbleType.DIFFICULTY}
        onLongPress={() => setOpenMenuAndEdit(EditModalTypes.difficulty)}
      />
      <RecipeDetailInfoBubble
        data={recipe.totalTime?.toString()}
        type={RecipeDetailInfoBubbleType.TIME}
        onLongPress={() => setOpenMenuAndEdit(EditModalTypes.time)}
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
