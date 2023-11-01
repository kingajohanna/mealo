import React from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { Colors } from '../theme/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

export enum RecipeDetailInfoBubbleType {
  RATING = 'The average rating of the recipe',
  TIME = 'The total time of cooking this recipe in minutes',
  SERVING = 'How many serving is the recipe',
  CALORIES = 'How many calories the recipe contains',
  DIFFICULTY = 'How difficulty to prepare this recipe',
}

type RecipeDetailInfoBubbleProps = {
  data?: string;
  type: RecipeDetailInfoBubbleType;
  onLongPress?: () => void;
};

export const RecipeDetailInfoBubble: React.FC<RecipeDetailInfoBubbleProps> = (props) => {
  const getIcon = (type: RecipeDetailInfoBubbleType) => {
    switch (type) {
      case RecipeDetailInfoBubbleType.RATING:
        return <IonIcon name="star" color={Colors.salmon} size={28} />;
      case RecipeDetailInfoBubbleType.CALORIES:
        return <FontistoIcon name="fire" color={Colors.salmon} size={28} />;
      case RecipeDetailInfoBubbleType.SERVING:
        return (
          <Image
            style={{ width: 28, height: 28, tintColor: Colors.salmon }}
            source={require('../assets/images/yields.png')}
          />
        );
      case RecipeDetailInfoBubbleType.DIFFICULTY:
        return <IonIcon name="cellular" color={Colors.salmon} size={28} />;
      case RecipeDetailInfoBubbleType.TIME:
      default:
        return <FontistoIcon name="clock" color={Colors.salmon} size={28} />;
    }
  };

  const toast = () => {
    if (Platform.OS === 'android') ToastAndroid.show(props.type, ToastAndroid.SHORT);
    else Alert.alert(props.type);
  };

  return (
    <Pressable
      style={[styles.background, { opacity: !props.data ? 0.5 : 1 }]}
      onLongPress={props.onLongPress}
      onPress={toast}
    >
      <View style={styles.iconBackground}>{getIcon(props.type)}</View>
      <Text numberOfLines={2} style={styles.text}>
        {props.data}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    height: 90,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.salmon,
  },
  iconBackground: {
    marginVertical: 5,
    height: 40,
    width: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.beige,
  },
  text: {
    flex: 1,
    alignSelf: 'center',
    color: Colors.beige,
    fontSize: 18,
  },
  header: {
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: Colors.pine,
    width: '100%',
    height: 70,
    borderWidth: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
