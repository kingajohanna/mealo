export const getCategory = (prediction: number) => {
  switch (prediction) {
    case 0:
      return "Appetizers";
    case 1:
      return "Breakfast and Brunch";
    case 2:
      return "Condiments and Sauces";
    case 3:
      return "Desserts";
    case 4:
      return "Main Dishes";
    case 5:
      return "Salads";
    case 6:
      return "Side Dishes";
    case 7:
      return "Soups";
  }
};

export const getCuisine = (prediction: number) => {
  switch (prediction) {
    case 0:
      return "American";
    case 1:
      return "Asian";
    case 2:
      return "Barbecue";
    case 3:
      return "Chinese";
    case 4:
      return "French";
    case 5:
      return "Greek";
    case 6:
      return "Indian";
    case 7:
      return "Italian";
    case 8:
      return "Mexican";
    case 9:
      return "Thai";
  }
};
