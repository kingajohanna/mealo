import { FlatList, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from '../TextInput';
import i18next, { t } from 'i18next';
import { SuggestionBubble, SuggestionBubbleType } from './SuggestionBubble';
import { useEffect, useState } from 'react';
import { getCategory, getCuisine, getDish } from '../../utils/suggestions';
import { Colors } from '../../theme/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Tag } from '../../screens/Suggestions';

type Props = {
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
  search: () => void;
  categoryTags: Tag[];
  setCategoryTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  cuisineTags: Tag[];
  setCuisineTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  dishTags: Tag[];
  setDishTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setSearchIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const CUISINE_MAX = 23;
const DISH_MAX = 44;
const CATEGORY_MAX = 8;

const dishes = Array.from({ length: DISH_MAX }, (_, i) => i);
const cuisines = Array.from({ length: CUISINE_MAX }, (_, i) => i);
const categories = Array.from({ length: CATEGORY_MAX }, (_, i) => i);

const TAGS = [
  ...dishes.map((dish) => ({ name: getDish(dish), type: SuggestionBubbleType.DISH, selected: true, id: dish })),
  ...cuisines.map((cuisine) => ({
    name: getCuisine(cuisine),
    type: SuggestionBubbleType.CUISINE,
    selected: false,
    id: cuisine,
  })),
  ...categories.map((category) => ({
    name: getCategory(category),
    type: SuggestionBubbleType.CATEGORY,
    selected: false,
    id: category,
  })),
];

export const SearchComponent: React.FC<Props> = ({
  onChangeText,
  text,
  search,
  setSearchIsActive,
  categoryTags,
  setCategoryTags,
  cuisineTags,
  setCuisineTags,
  dishTags,
  setDishTags,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setDishTags(
      sortTags(
        dishes.map((dish) => ({ name: getDish(dish), type: SuggestionBubbleType.DISH, selected: false, id: dish })),
      ),
    );
    setCuisineTags(
      sortTags(
        cuisines.map((cuisine) => ({
          name: getCuisine(cuisine),
          type: SuggestionBubbleType.CUISINE,
          selected: false,
          id: cuisine,
        })),
      ),
    );
    setCategoryTags(
      sortTags(
        categories.map((category) => ({
          name: getCategory(category),
          type: SuggestionBubbleType.CATEGORY,
          selected: false,
          id: category,
        })),
      ),
    );
  }, []);

  useEffect(() => {
    search();
  }, [categoryTags, cuisineTags, dishTags]);

  const sortTags = (tags: Tag[]) => {
    return tags
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .sort((a, b) => b.selected.toString().localeCompare(a.selected.toString()));
  };

  const onPress = (tag: Tag) => {
    switch (tag.type) {
      case SuggestionBubbleType.CUISINE:
        setCuisineTags(
          cuisineTags.map((t) => {
            if (t.name === tag.name && t.type === tag.type) {
              return { ...t, selected: !tag.selected };
            }
            return t;
          }),
        );
        break;
      case SuggestionBubbleType.CATEGORY:
        setCategoryTags(
          categoryTags.map((t) => {
            if (t.name === tag.name && t.type === tag.type) {
              return { ...t, selected: !tag.selected };
            }
            return t;
          }),
        );
        break;
      case SuggestionBubbleType.DISH:
        setDishTags(
          dishTags.map((t) => {
            if (t.name === tag.name && t.type === tag.type) {
              return { ...t, selected: !tag.selected };
            }
            return t;
          }),
        );
        break;
    }
  };

  const resetSearch = () => {
    onChangeText('');
    setCategoryTags(
      categoryTags.map((tag) => {
        return { ...tag, selected: false };
      }),
    );
    setCuisineTags(
      cuisineTags.map((tag) => {
        return { ...tag, selected: false };
      }),
    );
    setDishTags(
      dishTags.map((tag) => {
        return { ...tag, selected: false };
      }),
    );
    setSearchIsActive(false);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const setActive = () => {
    setSearchIsActive(true);
    setIsFocused(true);
  };

  const renderTags = (tags: Tag[]) => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tags}
        style={styles.tagContainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SuggestionBubble
            key={item.name + item.type}
            text={item.name}
            type={item.type}
            selected={item.selected}
            onPress={() => onPress(item)}
          />
        )}
      />
    );
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.rowContainer}>
        {isFocused && (
          <IonIcon
            name="chevron-back-circle-outline"
            size={40}
            color={Colors.salmon}
            style={{ paddingBottom: 6, paddingLeft: 8 }}
            onPress={resetSearch}
          />
        )}
        <TextInput
          style={{ flex: 1 }}
          onChangeText={onChangeText}
          onSubmitEditing={search}
          text={text}
          placeholder={i18next.t(`recipes:searchModalTitle`)}
          onFocus={setActive}
        />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8, flex: 1, justifyContent: 'space-evenly' }}>
        {isFocused && (
          <>
            {renderTags(dishTags)}
            {renderTags(cuisineTags)}
            {renderTags(categoryTags)}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    marginVertical: 4,
  },
});
