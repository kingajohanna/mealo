export const getCategory = (code: number) => {
  switch (code) {
    case 0:
      return "Appetizers";
    case 1:
      return "Beverages";
    case 2:
      return "Breakfast and Brunch";
    case 3:
      return "Condiments and Sauces";
    case 4:
      return "Desserts";
    case 5:
      return "Main Dishes";
    case 6:
      return "Salads";
    case 7:
      return "Side Dishes";
    case 8:
      return "Soups";
    default:
      return "Unknown";
  }
};

export const getCuisine = (code: number) => {
  switch (code) {
    case 0:
      return "American";
    case 1:
      return "Asian";
    case 2:
      return "Barbecue";
    case 3:
      return "Cajun & Creole";
    case 4:
      return "Chinese";
    case 5:
      return "Cuban";
    case 6:
      return "French";
    case 7:
      return "German";
    case 8:
      return "Greek";
    case 9:
      return "Hawaiian";
    case 10:
      return "Hungarian";
    case 11:
      return "Indian";
    case 12:
      return "Irish";
    case 13:
      return "Italian";
    case 14:
      return "Japanese";
    case 15:
      return "Mediterranean";
    case 16:
      return "Mexican";
    case 17:
      return "Moroccan";
    case 18:
      return "Portuguese";
    case 19:
      return "Southwestern";
    case 20:
      return "Spanish";
    case 21:
      return "Swedish";
    case 22:
      return "Thai";
    default:
      return "Unknown";
  }
};

export const getDish = (code: number) => {
  switch (code) {
    case 0:
      return "Antipasto";
    case 1:
      return "Burger";
    case 2:
      return "Burrito";
    case 3:
      return "Cake";
    case 4:
      return "Casserole";
    case 5:
      return "Cheesecake";
    case 6:
      return "Chili";
    case 7:
      return "Chowder";
    case 8:
      return "Cobbler";
    case 9:
      return "Cookies";
    case 10:
      return "Crepes";
    case 11:
      return "Cupcake";
    case 12:
      return "Curry";
    case 13:
      return "Donut";
    case 14:
      return "Duck";
    case 15:
      return "Dumpling";
    case 16:
      return "Fish and chips";
    case 17:
      return "Fudge";
    case 18:
      return "Gumbo";
    case 19:
      return "Ice cream";
    case 20:
      return "Lasagna";
    case 21:
      return "Lobster";
    case 22:
      return "Meatloaf";
    case 23:
      return "Oysters";
    case 24:
      return "Paella";
    case 25:
      return "Pancakes";
    case 26:
      return "Pasta";
    case 27:
      return "Pie";
    case 28:
      return "Pizza";
    case 29:
      return "Pork chops";
    case 30:
      return "Ramen";
    case 31:
      return "Ribs";
    case 32:
      return "Roast chicken";
    case 33:
      return "Salad";
    case 34:
      return "Salmon";
    case 35:
      return "Sandwich";
    case 36:
      return "Soup";
    case 37:
      return "Steak";
    case 38:
      return "Stir fry";
    case 39:
      return "Sushi";
    case 40:
      return "Tacos";
    case 41:
      return "Tart";
    case 42:
      return "Turkey";
    case 43:
      return "Wings";
    default:
      return "Unknown";
  }
};
