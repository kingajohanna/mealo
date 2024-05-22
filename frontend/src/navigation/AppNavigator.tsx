import { Recipes } from '../screens/Recipes';
import { Colors } from '../theme/colors';
import { AppNav } from './tabs';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
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
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { FolderScreen } from '../screens/FolderScreen';
import { RecipeFolderScreen } from '../screens/RecipeFolderScreen';
import { CalendarScreen } from '../screens/Calendar';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useStore } from '../stores';
import { observer } from 'mobx-react-lite';
import { Meals } from '../components/CalendarDay';
import { AddMeal } from '../screens/AddMeal';
import i18next from 'i18next';
import { RecipeVideo } from '../screens/RecipeVideo';
import { Suggestions } from '../screens/Suggestions';

export type RecipeStackParamList = {
  [AppNav.SUGGESTIONS]: undefined;
  [AppNav.RECIPES]: { recipes: Recipe[] };
  [AppNav.SHOPPINGLIST]: undefined;
  [AppNav.RECIPE]: { recipe: Recipe };
  [AppNav.READ_OCR]: undefined;
  [AppNav.COOKINGMODE]: { recipe: Recipe };
  [AppNav.TIMERS]: { recipe: Recipe };
  [AppNav.FOLDERS]: undefined;
  [AppNav.RECIPEFOLDER]: { filter: string; recipes: Recipe[] };
  [AppNav.ADDMEAL]: { date: string; mealType: Meals };
  [AppNav.VIDEO]: { recipe: Recipe };
};

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator<RecipeStackParamList>();

function RecipeNavigator() {
  return (
    <Tab.Navigator
      activeColor={Colors.beige}
      inactiveColor={Colors.beigeOp}
      initialRouteName={AppNav.RECIPENAVIGATOR}
      barStyle={styles.tabBar}
    >
      <Tab.Screen
        name={AppNav.CALENDAR}
        component={CalendarScreen}
        options={{
          tabBarLabel: i18next.t('tabs:planner'),
          tabBarIcon: ({ color }) => <IonIcon name="calendar" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name={AppNav.SHOPPINGLIST}
        component={ShoppingList}
        options={{
          tabBarLabel: i18next.t('tabs:list'),
          tabBarIcon: ({ color }) => <IonIcon name="list" color={color} size={28} />,
        }}
      />
      <Tab.Screen
        name={AppNav.RECIPENAVIGATOR}
        component={Suggestions}
        options={{
          tabBarLabel: i18next.t('tabs:recipes'),
          tabBarIcon: ({ color }) => <MaterialIcon name="book" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name={AppNav.FOLDERSTACK}
        component={FolderNavigator}
        options={{
          tabBarLabel: i18next.t('tabs:folders'),
          tabBarIcon: ({ color }) => <IonIcon name="folder-open" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name={AppNav.SETTINGS}
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
      <Stack.Screen name={AppNav.FOLDERS} component={FolderScreen} options={{ headerShown: false }} />
      <Stack.Screen name={AppNav.RECIPEFOLDER} component={RecipeFolderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export const AppNavigator = observer(() => {
  const { userStore } = useStore();
  return (
    <SafeAreaProvider style={styles.container}>
      <BottomSheetModalProvider>
        <Stack.Navigator initialRouteName={AppNav.SUGGESTIONS}>
          <Stack.Screen name={AppNav.SUGGESTIONS} component={RecipeNavigator} options={{ headerShown: false }} />
          <Stack.Screen name={AppNav.RECIPES} component={Recipes} options={{ headerShown: false }} />
          <Stack.Screen name={AppNav.RECIPEFOLDER} component={RecipeFolderScreen} options={{ headerShown: false }} />
          <Stack.Screen name={AppNav.RECIPE} component={RecipeDetails} options={{ headerShown: false }} />
          <Stack.Screen name={AppNav.COOKINGMODE} component={CookingMode} options={{ headerShown: false }} />
          <Stack.Screen
            name={AppNav.VIDEO}
            component={RecipeVideo}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name={AppNav.READ_OCR}
            component={AddRecipe}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name={AppNav.ADDMEAL}
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
