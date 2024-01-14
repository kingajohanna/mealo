import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { Colors } from '../theme/colors';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { Recipe } from '../types/recipe';
import FastImage from 'react-native-fast-image';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { ADD_LIST, ADD_MEAL } from '../api/mutations';
import { StackScreenProps } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { useStore } from '../stores';
import { Meals } from '../components/CalendarDay';
import { TextInput } from '../components/TextInput';
import { addReminder } from '../nativeModules/ReminderModule';

type Props = StackScreenProps<RecipeStackParamList, Tabs.ADDMEAL>;

export const AddMeal: React.FC<Props> = ({ route, navigation }) => {
  const { date, mealType } = route.params;

  const { userStore } = useStore();
  const [addMeal] = useAuthMutation(ADD_MEAL);
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const [addToList] = useAuthMutation(ADD_LIST);
  const [searchText, onChangeText] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>(data.getRecipes?.recipes);

  useEffect(() => {
    if (data?.getRecipes.recipes) {
      setRecipes(
        data?.getRecipes.recipes.filter((recipe: Recipe) =>
          recipe.title.toLowerCase().includes(searchText.toLowerCase()),
        ),
      );
    }
  }, [searchText]);

  const addToDay = async (recipe: Recipe) => {
    userStore.setLoading(true);

    const body = {
      recipeId: recipe.id,
      meal: { meal: mealType, day: date },
    };

    await addMeal({
      variables: body,
    });

    if (userStore.addIngredientsAutomatically)
      recipe.ingredients.map(async (ingredient) => {
        const reminder = await addReminder(ingredient);
        await addToList({
          variables: {
            name: ingredient,
            amount: '',
            id: reminder?.id,
          },
        });
      });

    await refetch();
    userStore.setLoading(false);
    navigation.goBack();
  };

  const getTitle = (meal: Meals) => {
    switch (meal) {
      case Meals.breakfast:
        return i18next.t('calendar:menu:breakfast');

      case Meals.lunch:
        return i18next.t('calendar:menu:lunch');

      case Meals.dinner:
        return i18next.t('calendar:menu:dinner');
    }
  };

  const renderRecipes = (recipe: Recipe) => {
    return (
      <Pressable style={styles.background} onPress={() => addToDay(recipe)} key={recipe.id}>
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
            {recipe.totalTime && <Text style={styles.text}>{recipe.totalTime} min</Text>}
            {recipe.category && <Text style={styles.text}>{recipe.category}</Text>}
            {recipe.cuisine && <Text style={styles.text}>{recipe.cuisine}</Text>}
          </View>
        </FastImage>
      </Pressable>
    );
  };

  return (
    <ScreenBackground fullscreen style={{ paddingTop: 70, paddingBottom: 0 }}>
      <Header title={i18next.t(`calendar:menu:${mealType}`)} />
      <TextInput
        onChangeText={onChangeText}
        text={searchText}
        placeholder={i18next.t('calendar:menu:whatsfor') + getTitle(mealType).toLowerCase() + '?'}
        style={{ width: '80%', marginTop: 10, marginBottom: 10 }}
      />
      <ScrollView>{recipes.map((recipe: Recipe) => renderRecipes(recipe))}</ScrollView>
    </ScreenBackground>
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
});
