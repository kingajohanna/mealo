import { Dimensions, Platform } from "react-native";

const screenHeight = Dimensions.get("screen").height;
const windowHeight = Dimensions.get("window").height;

/**
 * this is the virtual navigation bar height of android devices
 */
export const NAVBARHEIGHT = screenHeight - windowHeight;

/**
 * add extra padding for bottom modals
 */
export const androidBottomPadding = Platform.OS === "ios" ? 0 : NAVBARHEIGHT > 0 ? 0 : 20;
