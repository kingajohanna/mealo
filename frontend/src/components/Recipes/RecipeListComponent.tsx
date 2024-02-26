import React, { memo, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Recipe } from '../../types/recipe';
import { GET_RECIPES } from '../../api/queries';
import { useAuthMutation } from '../../hooks/useAuthMutation';
import { useAuthQuery } from '../../hooks/useAuthQuery';
import { DELETE_RECIPE, FAVORITE_RECIPE } from '../../api/mutations';
import i18next from 'i18next';

type ScreenBackgroundProps = {
  recipe: Recipe;
  onPress: () => void;
};

const RecipeListComponent: React.FC<ScreenBackgroundProps> = memo(({ recipe, onPress }) => {
  return (
    <Pressable style={styles.background} onPress={onPress}>
      <FastImage
        style={styles.image}
        source={{
          uri: recipe.image,
          priority: FastImage.priority.high,
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
  );
});

export const RecipeListComponentMemorized = React.memo(RecipeListComponent);

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
});
