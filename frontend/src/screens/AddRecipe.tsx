import React, { useEffect, useState } from 'react';
import { ScreenBackground } from '../components/Background';
import { useNavigation } from '@react-navigation/native';
import { ChooseTitle } from './addRecipeScreens/ChooseTitle';
import { Recipe } from '../types/recipe';
import { ReadOCR } from './addRecipeScreens/ReadOcr';
import { ChooseIngredients } from './addRecipeScreens/ChooseIngredients';
import { ChooseSteps } from './addRecipeScreens/ChooseSteps';
import { ChooseAdditionalInfo } from './addRecipeScreens/ChooseAdditionalInfo';

export type AddRecipeProps = {
  text: string;
  setText: (text: string) => void;
  recipe: Partial<Recipe>;
  setRecipe: (recipe: Partial<Recipe>) => void;
  back: () => void;
  next: () => void;
};

export const AddRecipe = () => {
  const navigation = useNavigation();
  const [activeDot, setActiveDot] = useState(0);

  const [text, setText] = useState('');
  const [recipe, setRecipe] = useState<Partial<Recipe>>({});

  const props = {
    text,
    setText,
    recipe,
    setRecipe,
    back: () => {
      activeDot === 0 ? navigation.goBack() : setActiveDot(activeDot - 1);
    },
    next: () => {
      activeDot === data.length - 1 ? navigation.goBack() : setActiveDot(activeDot + 1);
    },
  };

  const data = [
    <ReadOCR {...props} />,
    <ChooseTitle {...props} />,
    <ChooseIngredients {...props} />,
    <ChooseSteps {...props} />,
    <ChooseAdditionalInfo {...props} />,
  ];

  return (
    <ScreenBackground fullscreen style={{ paddingTop: 70 }}>
      {data[activeDot]}
    </ScreenBackground>
  );
};

const testText = `
Sure! Here is the recipe for Másnapos zabkása split into sections:

Előkészítés: 5 perc
Főzési/sütési idő: 0 perc

- 1 közepes méretű banán (hámozott)
- 120 ml félzsíros tej
- 40 g finom zabpehely
- 100 g görög joghurt (10% zsír)
- 5 g chiamag
- 1 kiskanál örölt fahéj
- 40 g friss málna

Nehézségi fok: könnyű
Adagok száma: 1 adag

1. Egy tálban villával nyomják össze a banánt.
2. Öntsék a tálba a tejet, adjók hozzá a zabpelyhet, a joghurtot, a chiamagot és a fahéjat.
3. Keverjék össze a tál tartalmát és adják hozzá a málnát.
4. Készítsenek elő zárható üveget, pl. befőttesüveget.
5. Ismét keverjék össze a tál tartalmát, majd toltsék át az üvegbe.
6. Zárják le az üveget, majd tegyék éjszakára a hűtőbe.

Másnap reggel már csak ki kell venni az üveget a hűtőből és kész is! A zabkásához friss szezonális gyümölcsöt is tehetnek bele.

Tápérték 1 adaghoz:
- Kalória: 472 kcal
- Fehérje: 15 g
- Szénhidrát: 56 g
- Zsír: 18 g

Ezt az ételt reggelire vagy tízóraira ajánlom! 😊
`;
