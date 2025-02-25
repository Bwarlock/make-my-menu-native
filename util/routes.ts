import { StackNavigationProp } from '@react-navigation/stack';
import { Restaurant, SendOtpData } from './interfaces';

export const AppStackRoute = 'AppStack';
export const AuthStackRoute = 'AuthStack';
export const AuthCheckRoute = 'AuthCheck';

export const LoginRoute = 'Login';
export const OtpRoute = 'Otp';
export const IntroRoute = 'Intro';

export const AddRestaurantRoute = 'AddRestaurant';
export const AddMenuItemRoute = 'AddMenuItem';
export const HomeViewRoute = 'HomeView';

export const MenuLink = (restaurant: string) => {
  return `https://${restaurant}.makemymenu.online/menu`;
};

// Define the route names and parameters
export type AuthStackParamList = {
  [IntroRoute]: undefined;
  [LoginRoute]: undefined;
  [OtpRoute]: SendOtpData;
};

export type AppStackParamList = {
  [HomeViewRoute]: undefined;
  [AddRestaurantRoute]: undefined;
  [AddMenuItemRoute]: Restaurant;
};

export type RootStackParamList = {
  [AuthCheckRoute]: undefined;
  [AuthStackRoute]: undefined;
  [AppStackRoute]: undefined;
};

// Define the navigation prop types
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
export type AppStackNavigationProp = StackNavigationProp<AppStackParamList>;
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
