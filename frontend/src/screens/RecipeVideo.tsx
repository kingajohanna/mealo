import { View, Text, Dimensions, StyleSheet, ScrollView, FlatList } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Colors } from '../theme/colors';
import { StackScreenProps } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { useRef } from 'react';
import { CheckableText } from '../components/CheckableText';
import KeepAwake from '@sayem314/react-native-keep-awake';
import Video from 'react-native-video';
import VideoRef from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';

type Props = StackScreenProps<RecipeStackParamList, Tabs.VIDEO>;

const height = (Dimensions.get('window').width / 16) * 9;

export const RecipeVideo: React.FC<Props> = ({ route }) => {
  const { recipe } = route.params;

  const videoRef = useRef<VideoRef>(null);

  const getYouTubeVideoId = (url: string) => {
    const embedRegex = /\/embed\/([a-zA-Z0-9_-]+)/;
    const watchRegex = /v=([a-zA-Z0-9_-]+)/;

    const embedMatch = url.match(embedRegex);
    const watchMatch = url.match(watchRegex);

    if (embedMatch) {
      return embedMatch[1];
    } else if (watchMatch) {
      return watchMatch[1];
    } else {
      return null;
    }
  };

  const renderIngredients = () => {
    if (recipe.ingredients.length > 0)
      return (
        <>
          <Text style={styles.bottomSheetTitle}>Ingredients</Text>
          <FlatList
            contentContainerStyle={{ paddingBottom: 10 }}
            style={styles.ingredientsContainer}
            data={recipe.ingredients}
            renderItem={({ item }) => (
              <CheckableText checkedStyle={styles.checkedText} style={styles.text}>
                <Text style={styles.text}>• </Text>
                <Text style={styles.text}>{item}</Text>
              </CheckableText>
            )}
          />
        </>
      );

    if (recipe.description) {
      return (
        <ScrollView contentContainerStyle={{ paddingBottom: 10, padding: 20 }}>
          <Text style={styles.bottomSheetTitle}>Description</Text>
          <Text style={styles.text}>{recipe.description}</Text>
        </ScrollView>
      );
    }
  };

  return (
    <>
      <ScreenBackground fullscreen notificationBarColor={Colors.beige} style={styles.screenBackground}>
        <KeepAwake />
        <View style={styles.container}>
          <Text style={styles.title}>{recipe.title}</Text>
          {recipe.video?.includes('youtube') ? (
            <View style={styles.youtubeVideo}>
              <YoutubePlayer height={height} play={true} videoId={getYouTubeVideoId(recipe.video) || ''} />
              {renderIngredients()}
            </View>
          ) : (
            <View style={styles.backgroundVideo}>
              <Video source={{ uri: recipe.video }} ref={videoRef} style={{ height: height }} controls={true} />
              {renderIngredients()}
            </View>
          )}
        </View>
      </ScreenBackground>
    </>
  );
};

const styles = StyleSheet.create({
  screenBackground: {
    paddingTop: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    color: Colors.pine,
    paddingTop: 10,
  },

  bottomSheetTitle: {
    fontSize: 20,
    color: Colors.pine,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  ingredientsContainer: {
    backgroundColor: Colors.beige,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 16,
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textDark,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 80,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.beige,
  },
  youtubeVideo: {
    position: 'absolute',
    top: 80,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.beige,
  },
});
