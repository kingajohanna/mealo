import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { Colors } from '../theme/colors';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu } from 'react-native-paper';
import { Recipe } from '../types/recipe';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { CalendarMealComponent } from './CalendarMealComponent';

type Props = {
  date: moment.Moment;
  recipes: Recipe[];
};

export enum Meals {
  breakfast = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
}

const mealsOrder = Object.values(Meals);

export type RecipesForDay = { recipe: Recipe; meal: { meal: string; day: string; id: string } };

export const CalendarDay: React.FC<Props> = ({ date, recipes }) => {
  const [data] = useAuthQuery(GET_RECIPES);
  const [openMenu, setOpenMenu] = useState(false);
  const [recipesForDay, setRecipesForDay] = useState<RecipesForDay[]>([]);
  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  useEffect(() => {
    const filteredRecipes: RecipesForDay[] = [];

    recipes.map((recipe) => {
      const meal = recipe.meals?.find((meal) => meal?.day === date.format('YYYY-MM-DD').toString());
      if (meal) {
        filteredRecipes.push({ recipe, meal });
      }
    });
    const sortedWeekdays = filteredRecipes.sort(
      (a, b) =>
        mealsOrder.indexOf(Meals[a.meal.meal as keyof typeof Meals]) -
        mealsOrder.indexOf(Meals[b.meal.meal as keyof typeof Meals]),
    );
    setRecipesForDay(sortedWeekdays);
  }, [data.getRecipes.recipes]);

  const navigateToAddMeal = (mealType: Meals) => {
    setOpenMenu(false);
    navigation.navigate(Tabs.ADDMEAL, { date: date.format('YYYY-MM-DD').toString(), mealType });
  };

  return (
    <View>
      <View
        style={[
          styles.dayContainer,
          { backgroundColor: date.isSame(moment(), 'day') ? Colors.salmonOp : Colors.pineOp },
        ]}
      >
        <View style={styles.dateContainer}>
          <Text
            style={[
              styles.dayText,
              {
                color: date.isSame(moment(), 'day') ? Colors.salmon : Colors.pine,
              },
            ]}
          >
            {date.date() < 10 ? '0' + date.date() : date.date()}
          </Text>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.smallText}>{i18next.t(`calendar:days:${date.day()}`)}</Text>
            <Text style={[styles.smallText, { opacity: 0.5 }]}>{i18next.t(`calendar:months:${date.month()}`)}</Text>
          </View>
        </View>
        <Menu
          contentStyle={styles.menu}
          visible={openMenu}
          onDismiss={() => {
            setOpenMenu(false);
          }}
          anchor={
            <Icon testID="menu-icon" name="add" size={40} color={Colors.salmon} onPress={() => setOpenMenu(true)} />
          }
        >
          <Menu.Item
            testID="breakfast-menu-item"
            style={styles.menu}
            onPress={() => {
              navigateToAddMeal(Meals.breakfast);
            }}
            title={i18next.t('calendar:menu:breakfast')}
          />
          <Menu.Item
            style={styles.menu}
            onPress={() => {
              navigateToAddMeal(Meals.lunch);
            }}
            title={i18next.t('calendar:menu:lunch')}
          />
          <Menu.Item
            style={styles.menu}
            onPress={() => {
              navigateToAddMeal(Meals.dinner);
            }}
            title={i18next.t('calendar:menu:dinner')}
          />
        </Menu>
      </View>
      {recipesForDay.map((recipe: RecipesForDay) => (
        <CalendarMealComponent recipe={recipe} key={recipe.recipe.id} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    borderRadius: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.pine,
    width: 70,
    textAlign: 'right',
  },
  smallText: {
    fontSize: 20,
    color: Colors.pine,
  },
  menu: {
    backgroundColor: Colors.beige,
    paddingVertical: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
