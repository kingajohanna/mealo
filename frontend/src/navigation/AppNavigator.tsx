import { Recipes } from '../screens/Recipes';
import { Colors } from '../theme/colors';
import { Tabs } from './tabs';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import { androidBottomPadding } from '../utils/androidHelper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { Recipe } from '../types/recipe';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { RecipeDetails } from '../screens/RecipeDetails';
import { Favourites } from '../screens/Favourites';
import { Settings } from '../screens/Settings';
import { AddRecipe } from '../screens/AddRecipe';
import { CookingMode } from '../screens/CookingModeScreen';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export type RecipeStackParamList = {
  Recipes: undefined;
  Favourites: undefined;
  Recipe: { recipe: Recipe };
  [Tabs.READ_OCR]: undefined;
  [Tabs.COOKINGMODE]: { recipe: Recipe };
};

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator<RecipeStackParamList>();

function RecipeNavigator() {
  return (
    <Tab.Navigator
      activeColor={Colors.beige}
      inactiveColor={Colors.beigeOp}
      initialRouteName={Tabs.RECIPENAVIGATOR}
      barStyle={styles.tabBar}
    >
      <Tab.Screen
        name={Tabs.RECIPEFAVNAVIGATOR}
        component={Favourites}
        options={{
          tabBarLabel: Tabs.FAVOURITES,
          tabBarIcon: ({ color }) => <IonIcon name="heart" color={color} size={28} />,
        }}
      />
      <Tab.Screen
        name={Tabs.RECIPENAVIGATOR}
        component={Recipes}
        options={{
          tabBarLabel: Tabs.RECIPES,
          tabBarIcon: ({ color }) => <MaterialIcon name="book" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name={Tabs.SETTINGS}
        component={Settings}
        options={{
          tabBarLabel: Tabs.SETTINGS,
          tabBarIcon: ({ color }) => <IonIcon name="ios-settings" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <SafeAreaProvider style={styles.container}>
      <BottomSheetModalProvider>
        <Stack.Navigator>
          <Stack.Screen name={Tabs.RECIPES} component={RecipeNavigator} options={{ headerShown: false }} />
          <Stack.Screen name={Tabs.RECIPE} component={RecipeDetails} options={{ headerShown: false }} />
          <Stack.Screen name={Tabs.COOKINGMODE} component={CookingMode} options={{ headerShown: false }} />
          <Stack.Screen
            name={Tabs.READ_OCR}
            component={AddRecipe}
            options={{ headerShown: false, presentation: 'modal' }}
          />
        </Stack.Navigator>
      </BottomSheetModalProvider>
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
