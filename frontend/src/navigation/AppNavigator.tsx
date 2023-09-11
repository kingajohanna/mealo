import {Recipes} from '../screens/Recipes';
import {Colors} from '../theme/colors';
import {Tabs} from './tabs';
import {StyleSheet} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import {androidBottomPadding} from '../utils/androidHelper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {Recipe} from '../types/recipe';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {RecipeDetails} from '../screens/RecipeDetails';
import {Favourites} from '../screens/Favourites';
import {Settings} from '../screens/Settings';

export type RecipeStackParamList = {
  Recipes: undefined;
  Favourites: undefined;
  Recipe: {recipe: Recipe};
};

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator<RecipeStackParamList>();

function RecipeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Tabs.RECIPES}
        component={Recipes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Tabs.RECIPE}
        component={RecipeDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function RecipeFavNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Tabs.FAVOURITES}
        component={Favourites}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Tabs.RECIPE}
        component={RecipeDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <SafeAreaProvider style={styles.container}>
      <Tab.Navigator
        activeColor={Colors.beige}
        inactiveColor={Colors.beigeOp}
        initialRouteName={Tabs.RECIPENAVIGATOR}
        barStyle={styles.tabBar}>
        <Tab.Screen
          name={Tabs.RECIPEFAVNAVIGATOR}
          component={RecipeFavNavigator}
          options={{
            tabBarLabel: Tabs.FAVOURITES,
            tabBarIcon: ({color}) => (
              <IonIcon name="heart" color={color} size={28} />
            ),
          }}
        />
        <Tab.Screen
          name={Tabs.RECIPENAVIGATOR}
          component={RecipeNavigator}
          options={{
            tabBarLabel: Tabs.RECIPES,
            tabBarIcon: ({color}) => (
              <MaterialIcon name="book" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name={Tabs.SETTINGS}
          component={Settings}
          options={{
            tabBarLabel: Tabs.SETTINGS,
            tabBarIcon: ({color}) => (
              <IonIcon name="ios-settings" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.beige,
  },
  tabBar: {
    position: 'absolute',
    borderWidth: 0.5,
    borderBottomWidth: 1,
    backgroundColor: Colors.pine,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderColor: Colors.pine,
    overflow: 'hidden',
    paddingBottom: androidBottomPadding,
  },
});
