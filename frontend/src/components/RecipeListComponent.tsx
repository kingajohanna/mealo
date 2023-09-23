import React, { useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../theme/colors';
import { Recipe } from '../types/recipe';
import { GET_RECIPES } from '../api/queries';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { DELETE_RECIPE, FAVORITE_RECIPE } from '../api/mutations';

type ScreenBackgroundProps = {
  recipe: Recipe;
  onPress: () => void;
};

export const RecipeListComponent: React.FC<ScreenBackgroundProps> = ({ recipe, onPress }) => {
  const [editFavoriteRecipe] = useAuthMutation(FAVORITE_RECIPE);
  const [deleteRecipe] = useAuthMutation(DELETE_RECIPE);
  const [refetch] = useAuthQuery(GET_RECIPES);

  const swipeableRef = useRef<Swipeable | null>(null);

  const close = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const renderRightAction = (dragX: {
    interpolate: (arg0: { inputRange: number[]; outputRange: number[] }) => any;
  }) => {
    const trans = dragX.interpolate({
      inputRange: [0, 0, 100, 104],
      outputRange: [0, 0, 0, 0],
    });

    const favHandler = () => {
      close();
      editFavoriteRecipe({
        variables: { recipeId: recipe.id },
      });
    };

    const deleteHandler = () => {
      close();
      Alert.alert('Delete recipe', 'Do you really want to delete this recipe?', [
        {
          text: 'Delete',
          onPress: async () => {
            await deleteRecipe({
              variables: { recipeId: recipe.id },
            });
            refetch();
          },
        },
        {
          text: 'Cancel',
        },
      ]);
    };

    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: trans }],
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          marginVertical: 8,
        }}
      >
        <Pressable style={{ ...styles.swipeableButton, backgroundColor: Colors.red }} onPress={deleteHandler}>
          <MaterialIcons name="delete" color={Colors.textLight} size={32} />
        </Pressable>
        <Pressable style={styles.swipeableButton} onPress={favHandler}>
          <Icon name={recipe.is_favorite ? 'heart' : 'heart-outline'} color={Colors.pine} size={32} />
        </Pressable>
      </Animated.View>
    );
  };

  const renderRightActions = (progress: {
    interpolate: (arg0: { inputRange: number[]; outputRange: number[] }) => any;
  }) => <View style={styles.rightActionsContainer}>{renderRightAction(progress)}</View>;

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
      <Pressable style={styles.background} onPress={onPress}>
        <FastImage
          style={styles.image}
          source={{
            uri: recipe.image,
            priority: FastImage.priority.normal,
          }}
        >
          <View style={styles.overlay} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.yields && <Text style={styles.text}>{recipe.yields}</Text>}
            {recipe.totalTime && <Text style={styles.text}>{recipe.totalTime} min</Text>}
            {recipe.category && <Text style={styles.text}>{recipe.category}</Text>}
            {recipe.cuisine && <Text style={styles.text}>{recipe.cuisine}</Text>}
          </View>
        </FastImage>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    padding: 8,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 15,
  },
  overlay: {
    borderRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  infoContainer: {
    padding: 15,
    paddingLeft: 30,
  },
  title: {
    fontSize: 18,
    color: Colors.textLight,
    fontWeight: 'bold',
    zIndex: 1,
    paddingBottom: 3,
  },
  text: {
    fontSize: 14,
    color: Colors.textLight,
  },
  rightActionsContainer: {
    width: 150,
    flexDirection: 'row',
  },
  swipeableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    borderRadius: 15,
  },
});
