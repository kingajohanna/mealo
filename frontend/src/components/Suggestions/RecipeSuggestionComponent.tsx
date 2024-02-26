import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Recipe } from '../../types/recipe';
import { Colors } from '../../theme/colors';

type Props = {
  recipe: Recipe;
  onPress: () => void;
  isMore?: boolean;
};

export const RecipeSuggestionComponent: React.FC<Props> = memo(({ recipe, onPress, isMore }) => {
  return (
    <Pressable style={styles.background} onPress={onPress}>
      <FastImage
        style={styles.image}
        source={
          isMore
            ? require('../../assets/images/moreBg.png')
            : {
                uri: recipe.image,
                priority: FastImage.priority.high,
              }
        }
      >
        <View style={styles.overlay} />

        <Text style={isMore ? styles.moreTitle : styles.title}>{recipe.title}</Text>
      </FastImage>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  background: {
    width: 180,
    height: 140,
    alignSelf: 'center',
    margin: 8,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 15,
    width: 180,
    height: 140,
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
  title: {
    fontSize: 18,
    color: Colors.textLight,
    fontWeight: 'bold',
    zIndex: 1,
    paddingTop: 64,
    paddingBottom: 8,
    paddingLeft: 16,
  },
  moreTitle: {
    fontSize: 18,
    color: Colors.textLight,
    fontWeight: 'bold',
    zIndex: 1,
    alignSelf: 'center',
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
