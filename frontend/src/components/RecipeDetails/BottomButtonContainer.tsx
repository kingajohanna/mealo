import react, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button } from '../Button';
import { Recipe } from '../../types/recipe';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../theme/colors';
import { StackScreenProps } from '@react-navigation/stack';
import { RecipeStackParamList } from '../../navigation/AppNavigator';
import { AppNav } from '../../navigation/tabs';
import i18next from 'i18next';
import { useAuthMutation } from '../../hooks/useAuthMutation';
import { FAVORITE_RECIPE } from '../../api/mutations';

type Props = {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
} & StackScreenProps<RecipeStackParamList, AppNav.RECIPE>;

const { width } = Dimensions.get('window');

export const BottomButtonContainer: react.FC<Props> = ({ recipe, navigation, setRecipe }) => {
  const [editFavoriteRecipe, fav_data] = useAuthMutation(FAVORITE_RECIPE);

  useEffect(() => {
    if (fav_data?.favorite_recipe) {
      setRecipe(fav_data.favoriteRecipe);
    }
  }, [fav_data]);

  const favHandler = () => {
    setRecipe({ ...recipe, is_favorite: !recipe.is_favorite });
    editFavoriteRecipe({
      variables: { recipeId: recipe.id },
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <Button
        icon={<IonIcon name={recipe.is_favorite ? 'heart' : 'heart-outline'} color={Colors.grey} size={32} />}
        style={[styles.smallButton, { borderColor: Colors.grey }]}
        onPress={favHandler}
      />
      {recipe.video && (
        <Button
          icon={<IonIcon name="play" color={Colors.pine} size={32} />}
          style={[styles.smallButton, { borderColor: Colors.pine }]}
          onPress={() => navigation.navigate(AppNav.VIDEO, { recipe })}
        />
      )}
      <Button
        title={i18next.t('recipeDetails:startCooking')}
        titleStyle={[styles.textMedium, { color: Colors.beige, textAlign: 'center' }]}
        style={[styles.cookButton, { width: recipe.video ? width - 54 - 54 - 60 : width - 54 - 60 }]}
        onPress={() => navigation.navigate(AppNav.COOKINGMODE, { recipe })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallButton: {
    borderWidth: 2,
    width: 54,
    paddingHorizontal: 0,
    justifyContent: 'center',
    marginRight: 8,
  },
  textMedium: {
    fontSize: 18,
    lineHeight: 24,
  },
  cookButton: {
    borderWidth: 2,
    backgroundColor: Colors.pine,
    borderColor: Colors.pine,
  },
});
