import {useStore} from '../stores';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useState} from 'react';
import {Alert} from 'react-native';
import SocialLoginScreen from './auth/SocialLoginScreen';
import en from '../locales/en';
import {Colors} from '../theme/colors';
import {WEB_CLIENT_ID, IOS_CLIENT_ID} from '@env';
import {firebaseEmail, firebasePassword} from '../utils/regex';
import {addUser} from '../contants/backend';

export const Login = () => {
  const {userStore} = useStore();
  const [isLoginButtonSpinner, setIsLoginButtonSpinner] = useState(false);
  const [loginText, setLoginText] = useState(en.auth.login.letscook);
  const [signUpText, setSignUpText] = useState(en.auth.signup.signup);
  const [loginTitleText, setLoginTitleText] = useState(
    en.auth.loginTitle.login,
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  const onGoogleButtonPress = async () => {
    try {
      setIsLoginButtonSpinner(true);
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(googleCredential);

      if (user.additionalUserInfo?.isNewUser) addUser();

      userStore.setIsLoggedIn(true);

      return;
    } catch (error: any) {
      console.log(error);

      // The user canceled the sign in request
      if (error.code === '-5') return;
      // else
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    } finally {
      setIsLoginButtonSpinner(false);
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

  const onLogin = async (email: string, password: string) => {
    try {
      if (
        !password ||
        !email ||
        !password.match(firebasePassword) ||
        !email.match(firebaseEmail)
      ) {
        return Alert.alert(en.auth.error.title, en.auth.error.text);
      }

      await auth().signInWithEmailAndPassword(email, password);
      userStore.setIsLoggedIn(true);

      return;
    } catch {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  const passwordReset = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return;
    } catch {
      return Alert.alert(en.auth.error.title, en.auth.error.text);
    }
  };

  return (
    <SocialLoginScreen
      onUserNameChangeText={email => setEmail(email)}
      onPasswordChangeText={password => setPassword(password)}
      onRepasswordChangeText={repassword => setRepassword(repassword)}
      onLoginPress={() => {
        loginText === en.auth.login.letscook
          ? onLogin(email, password)
          : onRegister(email, password, repassword);
      }}
      onForgotPasswordPress={() => passwordReset(email)}
      rightTopAssetImageSource={require('../assets/images/ramen.png')}
      leftBottomAssetImageSource={require('../assets/images/chef.png')}
      googleSpinnerVisibility={isLoginButtonSpinner}
      googleSpinnerColor={Colors.textLight}
      enableGoogleLogin
      onGoogleLoginPress={() => {
        onGoogleButtonPress();
      }}
      loginTitleText={loginTitleText}
      signUpText={signUpText}
      onSignUpPress={(isSignUp: boolean) => {
        setLoginText(isSignUp ? en.auth.login.signup : en.auth.login.signup);
        setSignUpText(isSignUp ? en.auth.signup.login : en.auth.signup.signup);
        setLoginTitleText(
          isSignUp ? en.auth.loginTitle.signup : en.auth.loginTitle.login,
        );
      }}
    />
  );
};
