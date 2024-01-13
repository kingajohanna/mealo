import * as React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { ScreenBackground } from '../components/Background';
import { Tabs } from '../navigation/tabs';
import { Colors } from '../theme/colors';
import auth from '@react-native-firebase/auth';
import { useStore } from '../stores';
import en from '../locales/en';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header } from '../components/Header';
import { DELETE_USER } from '../api/mutations';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { useApolloClient } from '@apollo/client';
import { Button } from '../components/Button';
import i18next from 'i18next';
import { Divider, List, Switch, Text } from 'react-native-paper';
import { observer } from 'mobx-react-lite';

export const Settings = observer(() => {
  const { userStore } = useStore();
  const { showCompletedTasks } = userStore;

  const client = useApolloClient();

  const clearStore = async () => {
    await client.clearStore();

    userStore.setIsLoggedIn(false);
  };

  const [deleteUser] = useAuthMutation(DELETE_USER);

  const onSignout = () => {
    try {
      Alert.alert('Logout', i18next.t('settings:logoutText'), [
        {
          text: i18next.t(`general:cancel`),
        },
        {
          text: i18next.t(`general:ok`),
          onPress: async () => {
            await clearStore();
            auth()
              .signOut()
              .then(() => userStore.setIsLoggedIn(false));
          },
        },
      ]);
    } catch (error) {
      return Alert.alert(i18next.t('auth:error:title'), i18next.t('auth:error:text'));
    }
  };

  const onDelete = () => {
    try {
      Alert.alert(i18next.t(`general:delete`), i18next.t('settings:deleteText'), [
        {
          text: i18next.t(`general:delete`),
          onPress: async () => {
            await deleteUser();
            await clearStore();
            auth()
              .currentUser?.delete()
              .then(() => userStore.setIsLoggedIn(false));
          },
        },
        {
          text: i18next.t(`general:cancel`),
        },
      ]);
    } catch (error) {
      return Alert.alert(i18next.t('auth:error.title'), i18next.t('auth.error:text'));
    }
  };

  return (
    <ScreenBackground style={{ paddingTop: 70 }}>
      <Header title={i18next.t('settings:title')} />
      <ScrollView style={styles.container}>
        <Button
          onPress={onSignout}
          style={{ width: '100%', height: 50 }}
          icon={<SimpleLineIcons name="logout" size={20} />}
          title={i18next.t('settings:logout')}
        />
        <Button
          onPress={onDelete}
          icon={<Icon name="person-remove-outline" size={24} color={Colors.beige} />}
          style={{ backgroundColor: Colors.red, height: 50, width: '100%' }}
          iconStyle={{ transform: [{ scaleX: -1 }] }}
          title={i18next.t('settings:deleteTitle')}
          titleStyle={{ color: Colors.beige }}
        />

        <List.Section>
          <List.Subheader>App Settings</List.Subheader>

          <List.Item
            title="Show checked Shopping items"
            description="Toggle to show/hide checked items"
            left={() => (
              <Switch value={showCompletedTasks} onValueChange={(value) => userStore.setShowCompletedTasks(value)} />
            )}
          />
          <Divider />
        </List.Section>
      </ScrollView>
    </ScreenBackground>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 16,
  },
});
