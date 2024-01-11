import * as React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { Colors } from '../theme/colors';
import { useRef } from 'react';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { REMOVE_MEAL } from '../api/mutations';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { Swipeable } from 'react-native-gesture-handler';
import { Meals, RecipesForDay } from './CalendarDay';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../stores';

type Props = {
  recipe: RecipesForDay;
};

export const CalendarMealComponent: React.FC<Props> = ({ recipe }) => {
  const { userStore } = useStore();

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const [removeMeal] = useAuthMutation(REMOVE_MEAL);
  const [data, refetch] = useAuthQuery(GET_RECIPES);

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
      inputRange: [0, 0, 52, 54],
      outputRange: [0, 0, 0, 0],
    });

    const deleteHandler = async () => {
      try {
        userStore.setLoading(true);

        close();

        await removeMeal({
          variables: { recipeId: recipe.recipe?.id, mealId: recipe.meal?.id },
        });
        await refetch();
        userStore.setLoading(false);
      } catch (error: any) {
        console.error('Error removing meal:', error.message);
      }
    };

    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: trans }],
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Pressable style={{ ...styles.swipeableButton, backgroundColor: Colors.red }} onPress={deleteHandler}>
          <MaterialIcons name="delete" color={Colors.textLight} size={24} />
        </Pressable>
      </Animated.View>
    );
  };

  const renderRightActions = (progress: {
    interpolate: (arg0: { inputRange: number[]; outputRange: number[] }) => any;
  }) => <View style={styles.rightActionsContainer}>{renderRightAction(progress)}</View>;

  const renderLogo = (mealType: string) => {
    switch (mealType) {
      case Meals.breakfast:
        return (
          <Image
            style={{ width: 40, height: 40, tintColor: Colors.pine, marginLeft: 30 }}
            source={require('../assets/images/breakfast.png')}
          />
        );
      case Meals.lunch:
        return (
          <Image
            style={{ width: 40, height: 40, tintColor: Colors.pine, marginLeft: 30 }}
            source={require('../assets/images/lunch.png')}
          />
        );
      case Meals.dinner:
        return (
          <Image
            style={{ width: 40, height: 40, tintColor: Colors.pine, marginLeft: 30 }}
            source={require('../assets/images/dinner.png')}
          />
        );
    }
  };

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
      <Pressable
        style={styles.dateContainer}
        key={recipe.recipe.id}
        onPress={() => navigation.navigate(Tabs.RECIPE, { recipe: recipe.recipe })}
      >
        {renderLogo(recipe.meal.meal)}
        <View style={{ marginLeft: 10, flexShrink: 1, marginVertical: 5 }}>
          <Text style={[styles.smallText, { color: Colors.pine }]}>{recipe.recipe.title}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 20,
    color: Colors.pine,
  },
  swipeableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    borderRadius: 5,
  },
  rightActionsContainer: {
    width: 100,
    flexDirection: 'row',
  },
});
