import * as React from 'react';
import {Text, View, StyleSheet, Pressable, Alert} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {ScreenBackground} from '../components/Background';
import {Tabs} from '../navigation/tabs';
import {Colors} from '../theme/colors';
import auth from '@react-native-firebase/auth';
import {useStore} from '../stores';
import en from '../locales/en';
import Icon from 'react-native-vector-icons/Ionicons';
import {Header} from '../components/Header';
import {deleteUser} from '../api/backend';

export const Settings = () => {
  const {userStore} = useStore();

  const onSignout = () => {
    try {
      Alert.alert('Logout', 'Click OK to logout!', [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            auth()
              .signOut()
              .then(() => userStore.setIsLoggedIn(false));
          },
        },
      ]);
    } catch (error) {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  const onDelete = () => {
    try {
      Alert.alert(
        'Delete',
        'Are you sure you want to delete your whole account?',
        [
          {
            text: 'Delete',
            onPress: () => {
              deleteUser();
              auth()
                .currentUser?.delete()
                .then(() => userStore.setIsLoggedIn(false));
            },
          },
          {
            text: 'Cancel',
            onPress: () => {},
          },
        ],
      );
    } catch (error) {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  return (
    <ScreenBackground>
      <Header title={Tabs.SETTINGS} />
      <View style={{marginTop: 25}}>
        <Pressable style={styles.buttonContainer} onPress={() => onSignout()}>
          <View style={styles.iconContainer}>
            <SimpleLineIcons name="logout" size={20} />
          </View>
          <Text style={styles.text}>Logout</Text>
        </Pressable>
        <Pressable
          style={{...styles.buttonContainer, backgroundColor: Colors.red}}
          onPress={() => onDelete()}>
          <View style={{...styles.iconContainer, transform: [{scaleX: 1}]}}>
            <Icon name="person-remove-outline" size={24} color={Colors.beige} />
          </View>
          <Text style={{...styles.text, color: Colors.beige}}>
            Delete account
          </Text>
        </Pressable>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.beige,
    width: 342,
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 20,
    alignItems: 'center',
    transform: [{scaleX: -1}],
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
  },
});
