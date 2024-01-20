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
import { ShoppingList } from '../screens/ShoppingList';
import { Settings } from '../screens/Settings';
import { AddRecipe } from '../screens/AddRecipe';
import { CookingMode } from '../screens/CookingModeScreen';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Timers } from '../screens/Timers';
import { FolderScreen } from '../screens/FolderScreen';
import { RecipeFolderScreen } from '../screens/RecipeFolderScreen';
import { CalendarScreen } from '../screens/Calendar';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useStore } from '../stores';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { Meals } from '../components/CalendarDay';
import { AddMeal } from '../screens/AddMeal';
import i18next from 'i18next';
import { RecipeVideo } from '../screens/RecipeVideo';

export type RecipeStackParamList = {
  [Tabs.RECIPES]: undefined;
  [Tabs.SHOPPINGLIST]: undefined;
  [Tabs.RECIPE]: { recipe: Recipe };
  [Tabs.READ_OCR]: undefined;
  [Tabs.COOKINGMODE]: { recipe: Recipe };
  [Tabs.TIMERS]: { recipe: Recipe };
  [Tabs.FOLDERS]: undefined;
  [Tabs.RECIPEFOLDER]: { filter: string; recipes: Recipe[] };
  [Tabs.ADDMEAL]: { date: string; mealType: Meals };
  [Tabs.VIDEO]: { recipe: Recipe };
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
        name={Tabs.CALENDAR}
        component={CalendarScreen}
        options={{
          tabBarLabel: i18next.t('tabs:planner'),
          tabBarIcon: ({ color }) => <IonIcon name="calendar" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name={Tabs.SHOPPINGLIST}
        component={ShoppingList}
        options={{
          tabBarLabel: i18next.t('tabs:list'),
          tabBarIcon: ({ color }) => <IonIcon name="list" color={color} size={28} />,
        }}
      />
      <Tab.Screen
        name={Tabs.RECIPENAVIGATOR}
        component={Recipes}
        options={{
          tabBarLabel: i18next.t('tabs:recipes'),
          tabBarIcon: ({ color }) => <MaterialIcon name="book" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name={Tabs.FOLDERSTACK}
        component={FolderNavigator}
        options={{
          tabBarLabel: i18next.t('tabs:folders'),
          tabBarIcon: ({ color }) => <IonIcon name="folder-open" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name={Tabs.SETTINGS}
        component={Settings}
        options={{
          tabBarLabel: i18next.t('tabs:settings'),
          tabBarIcon: ({ color }) => <IonIcon name="ios-settings" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}

const FolderNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={Tabs.FOLDERS} component={FolderScreen} options={{ headerShown: false }} />
      <Stack.Screen name={Tabs.RECIPEFOLDER} component={RecipeFolderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export const AppNavigator = observer(() => {
  const { userStore } = useStore();
  return (
    <SafeAreaProvider style={styles.container}>
      <BottomSheetModalProvider>
        <Stack.Navigator>
          <Stack.Screen name={Tabs.RECIPES} component={RecipeNavigator} options={{ headerShown: false }} />
          <Stack.Screen name={Tabs.RECIPEFOLDER} component={RecipeFolderScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Tabs.RECIPE} component={RecipeDetails} options={{ headerShown: false }} />
          <Stack.Screen name={Tabs.COOKINGMODE} component={CookingMode} options={{ headerShown: false }} />
          <Stack.Screen
            name={Tabs.VIDEO}
            component={RecipeVideo}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name={Tabs.READ_OCR}
            component={AddRecipe}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name={Tabs.ADDMEAL}
            component={AddMeal}
            options={{ headerShown: false, presentation: 'modal' }}
          />
        </Stack.Navigator>
      </BottomSheetModalProvider>
      {userStore.loading && <LoadingOverlay />}
    </SafeAreaProvider>
  );
});

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
