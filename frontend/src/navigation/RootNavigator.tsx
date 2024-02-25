import { useStore } from '../stores';
import { AuthNavigator } from './AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { AppNavigator } from './AppNavigator';
import ShareMenu, { ShareCallback, ShareData } from 'react-native-share-menu';
import { urlCheck } from '../utils/regex';
import { Alert, Platform } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { observer } from 'mobx-react-lite';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { ADD_RECIPE, ANALYZE_RECIPE } from '../api/mutations';
import { useApolloClient } from '@apollo/client';
import i18next from 'i18next';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { GET_RECIPES } from '../api/queries';

export const RootNavigation = observer(() => {
  const { userStore } = useStore();

  const [addRecipe] = useAuthMutation(ADD_RECIPE);
  const [analizeRecipe] = useAuthMutation(ANALYZE_RECIPE);
  const [data, refetch] = useAuthQuery(GET_RECIPES);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, []);

  const addRecipeWrapper = async (url: string) => {
    userStore.setLoading(true);

    const recipe_data = await addRecipe({
      variables: { url },
    });

    analizeRecipe({
      variables: { recipeId: recipe_data?.data.addRecipe.id },
    });

    await refetch();
    userStore.setLoading(false);
  };

  const handleShare: ShareCallback = useCallback((share?: ShareData) => {
    if (!share) {
      return;
    }

    const { data } = share;

    const url = Array.isArray(data) ? data[0] : data;

    if (url.match(urlCheck) && Platform.OS === 'ios') {
      addRecipeWrapper(url);
    } else {
      Alert.alert('Add recipe', 'Do you want to add this recipe to your collection?', [
        {
          text: i18next.t(`general:cancel`),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            addRecipeWrapper(url);
          },
        },
      ]);
    }
  }, []);

  return (
    <NavigationContainer onReady={() => RNBootSplash.hide()}>
      {userStore.isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
});
