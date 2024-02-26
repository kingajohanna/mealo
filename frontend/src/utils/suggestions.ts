import i18next from 'i18next';

export const getCategory = (code: number) => {
  switch (code) {
    case 0:
      return i18next.t('suggestions:appetizers');
    case 1:
      return i18next.t('suggestions:beverages');
    case 2:
      return i18next.t('suggestions:breakfastAndBrunch');
    case 3:
      return i18next.t('suggestions:condimentsAndSauces');
    case 4:
      return i18next.t('suggestions:desserts');
    case 5:
      return i18next.t('suggestions:mainDishes');
    case 6:
      return i18next.t('suggestions:salads');
    case 7:
      return i18next.t('suggestions:sideDishes');
    case 8:
      return i18next.t('suggestions:soups');
    default:
      return 'Unknown';
  }
};

export const getCuisine = (code: number) => {
  switch (code) {
    case 0:
      return i18next.t('suggestions:american');
    case 1:
      return i18next.t('suggestions:asian');
    case 2:
      return i18next.t('suggestions:barbecue');
    case 3:
      return i18next.t('suggestions:cajunAndCreole');
    case 4:
      return i18next.t('suggestions:chinese');
    case 5:
      return i18next.t('suggestions:cuban');
    case 6:
      return i18next.t('suggestions:french');
    case 7:
      return i18next.t('suggestions:german');
    case 8:
      return i18next.t('suggestions:greek');
    case 9:
      return i18next.t('suggestions:hawaiian');
    case 10:
      return i18next.t('suggestions:hungarian');
    case 11:
      return i18next.t('suggestions:indian');
    case 12:
      return i18next.t('suggestions:irish');
    case 13:
      return i18next.t('suggestions:italian');
    case 14:
      return i18next.t('suggestions:japanese');
    case 15:
      return i18next.t('suggestions:mediterranean');
    case 16:
      return i18next.t('suggestions:mexican');
    case 17:
      return i18next.t('suggestions:morrocan');
    case 18:
      return i18next.t('suggestions:portuguese');
    case 19:
      return i18next.t('suggestions:southwestern');
    case 20:
      return i18next.t('suggestions:spanish');
    case 21:
      return i18next.t('suggestions:swedish');
    case 22:
      return i18next.t('suggestions:thai');
    default:
      return 'Unknown';
  }
};

export const getDish = (code: number) => {
  switch (code) {
    case 0:
      return i18next.t('suggestions:antipasto');
    case 1:
      return i18next.t('suggestions:burger');
    case 2:
      return i18next.t('suggestions:burrito');
    case 3:
      return i18next.t('suggestions:cake');
    case 4:
      return i18next.t('suggestions:casserole');
    case 5:
      return i18next.t('suggestions:cheesecake');
    case 6:
      return i18next.t('suggestions:chili');
    case 7:
      return i18next.t('suggestions:chowder');
    case 8:
      return i18next.t('suggestions:cobbler');
    case 9:
      return i18next.t('suggestions:cookies');
    case 10:
      return i18next.t('suggestions:crepes');
    case 11:
      return i18next.t('suggestions:cupcake');
    case 12:
      return i18next.t('suggestions:curry');
    case 13:
      return i18next.t('suggestions:donut');
    case 14:
      return i18next.t('suggestions:duck');
    case 15:
      return i18next.t('suggestions:dumpling');
    case 16:
      return i18next.t('suggestions:fishAndChips');
    case 17:
      return i18next.t('suggestions:fudge');
    case 18:
      return i18next.t('suggestions:gumbo');
    case 19:
      return i18next.t('suggestions:iceCream');
    case 20:
      return i18next.t('suggestions:lasagna');
    case 21:
      return i18next.t('suggestions:lobster');
    case 22:
      return i18next.t('suggestions:meatloaf');
    case 23:
      return i18next.t('suggestions:oysters');
    case 24:
      return i18next.t('suggestions:paella');
    case 25:
      return i18next.t('suggestions:pancakes');
    case 26:
      return i18next.t('suggestions:pasta');
    case 27:
      return i18next.t('suggestions:pie');
    case 28:
      return i18next.t('suggestions:pizza');
    case 29:
      return i18next.t('suggestions:porkChops');
    case 30:
      return i18next.t('suggestions:ramen');
    case 31:
      return i18next.t('suggestions:ribs');
    case 32:
      return i18next.t('suggestions:roastChicken');
    case 33:
      return i18next.t('suggestions:salad');
    case 34:
      return i18next.t('suggestions:salmon');
    case 35:
      return i18next.t('suggestions:sandwich');
    case 36:
      return i18next.t('suggestions:soup');
    case 37:
      return i18next.t('suggestions:steak');
    case 38:
      return i18next.t('suggestions:stirFry');
    case 39:
      return i18next.t('suggestions:sushi');
    case 40:
      return i18next.t('suggestions:tacos');
    case 41:
      return i18next.t('suggestions:tart');
    case 42:
      return i18next.t('suggestions:turkey');
    case 43:
      return i18next.t('suggestions:wings');
    default:
      return 'Unknown';
  }
};
