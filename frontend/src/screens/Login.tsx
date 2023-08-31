import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useStore} from '../stores';
import en from '../locales/en';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {IOS_CLIENT_ID, WEB_CLIENT_ID} from '@env';
import auth from '@react-native-firebase/auth';
import {Colors} from '../theme/colors';
import {firebaseEmail, firebasePassword} from '../utils/regex';
import {addUser} from '../api/backend';
import SocialButton from '../components/SocialButton/SocialButton';
import {AuthTextField} from '../components/AuthTextField/AuthTextField';
import {AuthTabs} from '../navigation/tabs';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width: ScreenWidth, height: ScreenHeight} = Dimensions.get('window');

const googleLogo = require('../assets/images/google-logo.png');

export const Login = () => {
  const {userStore} = useStore();
  const navigation = useNavigation();

  const [isLoginButtonSpinner, setIsLoginButtonSpinner] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  const onGoogleButtonPress = async () => {
    try {
      setIsLoginButtonSpinner(true);
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(googleCredential);

      if (user.additionalUserInfo?.isNewUser) {
        addUser();
      }

      userStore.setIsLoggedIn(true);
    } catch (error: any) {
      console.log(error);

      if (error.code === '-5') {
        return;
      }

      Alert.alert(en.auth.error.title, en.auth.error.text);
    } finally {
      setIsLoginButtonSpinner(false);
    }
  };

  const onLogin = async (email: string, password: string) => {
    try {
      if (
        !password ||
        !email ||
        !password.match(firebasePassword) ||
        !email.match(firebaseEmail)
      ) {
        Alert.alert(en.auth.error.title, en.auth.error.text);
      } else {
        await auth().signInWithEmailAndPassword(email, password);
        userStore.setIsLoggedIn(true);
      }
    } catch {
      Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  const onRegister = async (
    email: string,
    password: string,
    repassword: string,
  ) => {
    try {
      if (
        !password ||
        !repassword ||
        !email ||
        password !== repassword ||
        !password.match(firebasePassword) ||
        !email.match(firebaseEmail)
      ) {
        return Alert.alert(en.auth.error.title, en.auth.error.text);
      }

      await auth().createUserWithEmailAndPassword(email, password);
      addUser();
      userStore.setIsLoggedIn(true);

      return;
    } catch {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  const passwordReset = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch {
      Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerContainerGlue}
          onPress={() => setIsLogin(!isLogin)}>
          <MaterialCommunityIcons
            name="chevron-left"
            color="#777684"
            size={20}
          />
          <Text style={styles.signUpTextStyle}>
            {isLogin ? en.auth.signup.title : en.auth.login.title}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rightTopAssetContainer}>
        <Image
          resizeMode="contain"
          source={require('../assets/images/ramen.png')}
          style={styles.rightTopAssetImageStyle}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.loginTitleContainer}>
          <Text style={styles.loginTextStyle}>
            {isLogin ? en.auth.login.title : en.auth.signup.title}
          </Text>
        </View>
        <View style={styles.textFieldContainer}>
          <AuthTextField
            placeholder={'john_doe@example.com'}
            onChangeText={setEmail}
          />
          <View style={styles.passwordTextFieldContainer}>
            <AuthTextField
              width="70%"
              secureTextEntry
              placeholder={'• • • • • • • •'}
              onChangeText={setPassword}
            />
          </View>
          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => passwordReset(email)}>
              <Text style={styles.forgotPasswordTextStyle}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          )}
          {!isLogin && (
            <View style={styles.passwordTextFieldContainer}>
              <AuthTextField
                width="70%"
                secureTextEntry
                placeholder={'• • • • • • • •'}
                onChangeText={password => setRepassword(password)}
              />
            </View>
          )}
        </View>
        <View style={styles.socialButtonsContainer}>
          <SocialButton
            text={isLogin ? en.auth.login.button : en.auth.signup.title}
            onPress={() =>
              isLogin
                ? onLogin(email, password)
                : onRegister(email, password, repassword)
            }
            shadowColor={Colors.pine}
            backgroundColor={Colors.aqua}
          />
          <ScrollView
            style={styles.socialButtonsContainerGlue}
            contentInset={styles.socialLoginButtonsContentInset}>
            <View style={styles.socialLoginButtonContainer}>
              <SocialButton
                width={60}
                height={60}
                backgroundColor="#fff"
                isSpinner={isLoginButtonSpinner}
                spinnerColor={Colors.textLight}
                onPress={onGoogleButtonPress}
                component={
                  <Image
                    source={googleLogo}
                    style={styles.socialLoginButtonImageStyle}
                  />
                }
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.leftBottomAssetContainer}>
        <Image
          resizeMode="contain"
          source={require('../assets/images/chef.png')}
          style={styles.leftBottomAssetImageStyle}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 16,
    marginLeft: 32,
  },
  headerContainerGlue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpTextStyle: {
    fontSize: 16,

    color: '#777684',
  },
  loginTitleContainer: {
    marginLeft: 32,
  },
  loginTextStyle: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  textFieldContainer: {
    marginTop: 48,
  },
  passwordTextFieldContainer: {
    marginTop: 24,
    height: 40,
  },
  forgotPasswordContainer: {
    marginTop: 24,
    marginLeft: 32,
    height: 40,
  },
  forgotPasswordTextStyle: {
    fontSize: 14,
    color: '#b1b2ba',
  },
  socialLoginButtonContainer: {
    marginTop: 12,
  },
  facebookImageStyle: {
    width: 25,
    height: 25,
  },
  appleImageStyle: {
    width: 25,
    height: 25,
    left: 3,
  },
  socialLoginButtonImageStyle: {
    left: 3,
    width: 25,
    height: 25,
  },
  socialButtonsContainer: {
    marginTop: 32,
  },
  socialButtonsContainerGlue: {
    paddingBottom: 32,
  },
  socialLoginButtonsContentInset: {
    bottom: 100,
  },
  contentContainer: {
    marginTop: ScreenHeight * 0.1,
  },
  rightTopAssetContainer: {
    top: -100,
    right: -150,
    position: 'absolute',
  },
  rightTopAssetImageStyle: {
    width: ScreenWidth,
    height: ScreenWidth * 0.9,
  },
  leftBottomAssetContainer: {
    left: -100,
    bottom: -30,
    position: 'absolute',
  },
  leftBottomAssetImageStyle: {
    width: ScreenWidth,
    height: ScreenWidth * 0.9,
  },
});
