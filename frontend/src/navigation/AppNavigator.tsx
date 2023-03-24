import {Recipes} from '../screens/Recipes';
import {Colors} from '../theme/colors';
import {Tabs} from './tabs';
import {StyleSheet} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {androidBottomPadding} from '../utils/androidHelper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {Recipe} from '../types/recipe';
import Icon from 'react-native-vector-icons/Ionicons';

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
    </Stack.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <SafeAreaProvider style={{backgroundColor: Colors.background}}>
      <Tab.Navigator
        activeColor={Colors.verdigris}
        inactiveColor={Colors.teal}
        initialRouteName={Tabs.RECIPENAVIGATOR}
        barStyle={styles.tabBar}>
        <Tab.Screen
          name={Tabs.RECIPEFAVNAVIGATOR}
          component={RecipeNavigator}
          options={{
            tabBarLabel: Tabs.RECIPES,
            tabBarIcon: ({color}) => (
              <Icon name="heart-outline" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name={Tabs.RECIPENAVIGATOR}
          component={RecipeNavigator}
          options={{
            tabBarLabel: Tabs.RECIPES,
            tabBarIcon: ({color}) => (
              <SimpleLineIcons name="notebook" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name={Tabs.SETTINGS}
          component={RecipeNavigator}
          options={{
            tabBarLabel: Tabs.SETTINGS,
            tabBarIcon: ({color}) => (
              <SimpleLineIcons name="settings" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderWidth: 0.5,
    borderBottomWidth: 1,
    backgroundColor: Colors.gainsboro,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: 'transparent',
    overflow: 'hidden',
    paddingBottom: androidBottomPadding,
  },
});
