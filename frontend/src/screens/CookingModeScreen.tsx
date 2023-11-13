import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Colors } from '../theme/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '../components/Button';
import { BottomButtons } from '../components/BottomButtons';
import { StackScreenProps } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { Tabs } from '../navigation/tabs';
import { useCallback, useMemo, useRef, useState } from 'react';
import { CheckableText } from '../components/CheckableText';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import KeepAwake from '@sayem314/react-native-keep-awake';
import { Timers } from './Timers';

type Props = StackScreenProps<RecipeStackParamList, Tabs.COOKINGMODE>;

export const CookingMode: React.FC<Props> = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [instructionIndex, setInstructionIndex] = useState(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRefTimer = useRef<BottomSheetModal>(null);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => bottomSheetModalRef.current?.dismiss()}
      />
    ),
    [],
  );

  return (
    <>
      <ScreenBackground fullscreen notificationBarColor={Colors.beige} style={styles.screenBackground}>
        <KeepAwake />
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconsContainer}>
              <IonIcon
                name="list"
                color={Colors.pine}
                size={50}
                style={styles.icon}
                onPress={() => bottomSheetModalRef.current?.present()}
              />
              <MaterialCommunityIcon
                name="timer-outline"
                color={Colors.pine}
                size={50}
                onPress={() => bottomSheetModalRefTimer.current?.present()}
              />
            </View>

            <IonIcon name="close" color={Colors.pine} size={50} onPress={() => navigation.goBack()} />
          </View>

          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>{recipe.instructions[instructionIndex]}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              setInstructionIndex(instructionIndex - 1);
            }}
            disabled={instructionIndex === 0}
            title={'Back'}
            style={styles.backButton}
            titleStyle={styles.backButtonText}
          />
          <Button
            onPress={() => {
              setInstructionIndex(instructionIndex + 1);
            }}
            disabled={instructionIndex === recipe.instructions.length - 1}
            title={'Next'}
            style={styles.nextButton}
            titleStyle={styles.nextButtonText}
          />
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['50%']}
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheetBackground}
        >
          <Text style={styles.bottomSheetTitle}>Ingredients</Text>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <CheckableText checkedStyle={styles.checkedText} key={'ingredient' + index} style={styles.text}>
                <Text style={styles.text}>• </Text>
                <Text style={styles.text}>{ingredient}</Text>
              </CheckableText>
            ))}
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          ref={bottomSheetModalRefTimer}
          index={0}
          snapPoints={['60%']}
          backdropComponent={useCallback(
            (props: any) => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                onPress={() => bottomSheetModalRefTimer.current?.dismiss()}
              />
            ),
            [],
          )}
          backgroundStyle={styles.bottomSheetBackground}
        >
          <Timers recipe={recipe} onClose={() => bottomSheetModalRefTimer.current?.dismiss()} />
        </BottomSheetModal>
      </ScreenBackground>
    </>
  );
};

const styles = StyleSheet.create({
  screenBackground: {
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: Colors.beige,
    width: '50%',
    height: 80,
    borderColor: Colors.salmon,
    borderWidth: 2,
  },
  backButtonText: {
    textAlign: 'center',
    color: Colors.salmon,
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: Colors.salmon,
    width: '50%',
    height: 80,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: Colors.pine,
    paddingTop: 10,
  },
  instructionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionsText: {
    fontSize: 18,
    textAlign: 'auto',
  },
  bottomSheetBackground: {
    backgroundColor: Colors.beige,
    borderTopColor: Colors.salmon,
    borderTopWidth: 3,
  },
  bottomSheetTitle: {
    fontSize: 20,
    color: Colors.pine,
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
});
