import i18next from 'i18next';
import { List, ToggleButton } from 'react-native-paper';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { GET_RECIPE, GET_USER } from '../api/queries';
import { Share } from '../types/user';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RecipeStackParamList } from '../navigation/AppNavigator';
import { AppNav } from '../navigation/tabs';
import { Colors } from '../theme/colors';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { MANAGE_SHARE } from '../api/mutations';

type Props = {
  share: Share;
  refetchUser: () => Promise<void>;
};

export const ShareComponent: React.FC<Props> = (props) => {
  const [data] = useAuthQuery(GET_RECIPE, {
    variables: { recipeId: props.share.recipe },
  });
  const [manageShare] = useAuthMutation(MANAGE_SHARE);

  const navigation = useNavigation<StackNavigationProp<RecipeStackParamList>>();

  const manageShareHandler = async (accepted: boolean) => {
    await manageShare({
      variables: { shareId: props.share.id, id: data?.getRecipe?.id, accept: accepted },
    });
    await props.refetchUser();
  };

  return (
    <List.Item
      style={{ maxWidth: '100%', width: '100%' }}
      title={data?.getRecipe?.title}
      titleNumberOfLines={2}
      onPress={() => {
        navigation.navigate(AppNav.RECIPE, { recipe: data?.getRecipe });
      }}
      left={() => (
        <ToggleButton.Row onValueChange={() => {}} value={''}>
          <ToggleButton
            icon="check"
            value="accept"
            onPress={() => {
              manageShareHandler(true);
            }}
            iconColor={Colors.pine}
            rippleColor={Colors.pineOp}
          />
          <ToggleButton
            icon="close"
            value="cancel"
            onPress={() => {
              manageShareHandler(false);
            }}
            iconColor={Colors.salmon}
            rippleColor={Colors.salmonOp}
          />
        </ToggleButton.Row>
      )}
    />
  );
};
