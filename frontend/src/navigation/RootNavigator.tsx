import {useStore} from '../stores';
import {AuthNavigator} from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';

import React, {useCallback, useEffect} from 'react';
import {AppNavigator} from './AppNavigator';
import ShareMenu, {ShareCallback, ShareData} from 'react-native-share-menu';
import {urlCheck} from '../utils/regex';
import {Alert, Platform} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import {GET_RECIPES} from '../api/queries';
import {observer} from 'mobx-react-lite';
import {useAuthQuery} from '../hooks/useAuthQuery';
import {useAuthMutation} from '../hooks/useAuthMutation';
import {ADD_RECIPE} from '../api/mutations';

export const RootNavigation = observer(() => {
  const {userStore} = useStore();

  const [addRecipe] = useAuthMutation(ADD_RECIPE);
  const [refetch] = useAuthQuery(GET_RECIPES);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, []);

  const addRecipeWrapper = async (url: string) => {
    await addRecipe({
      variables: {url},
    });
    await refetch();
  };

  const handleShare: ShareCallback = useCallback((share?: ShareData) => {
    if (!share) {
      return;
    }

    const {data} = share;

    const url = Array.isArray(data) ? data[0] : data;

    if (url.match(urlCheck) && Platform.OS === 'ios') {
      addRecipeWrapper(url);
    } else {
      Alert.alert(
        'Add recipe',
        'Do you want to add this recipe to your collection?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              addRecipeWrapper(url);
            },
          },
        ],
      );
    }
  }, []);

  return (
    <NavigationContainer onReady={() => RNBootSplash.hide()}>
      {userStore.isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
});
