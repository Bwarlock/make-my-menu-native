// import { Alert } from "react-native";
import { Alert } from 'react-native';
import {
  DeleteRestaurant,
  GetRestaurant,
  GetRestaurants,
  Login,
  MenuToJson,
  OnBoardRestaurant,
  SendOtp,
  UpdateRestaurant,
} from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  AuthCheckRoute,
  OtpRoute,
  RootStackNavigationProp,
} from '../util/routes';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearGlobal,
  storeImageApiLoading,
  storeCurrentUser,
  storeRestaurants,
  storeToken,
  storeRestaurantLoading,
} from '../store/globalSlice';
import {
  ErrorResponse,
  LoginData,
  SendOtpData,
  OnBoardRestaurantData,
  Restaurant,
  MenuItem,
  MenuToJsonData,
  MenuToJsonItem,
} from '../util/interfaces';
import { AxiosError } from 'axios';
import { AppDispatch } from '../store/store';

interface ApiResponse<T> {
  data: T;
}

interface User {
  id: string;
  name: string;
  authToken: { token: string };
}

interface RestaurantResponse {
  restaurants: object[];
}

const handleAxiosError = (error: unknown) => {
  if (isAxiosError(error)) {
    // If error is an Axios error, handle it accordingly
    const message = error.response?.data?.message ?? error.message;
    Alert.alert('Error', message);
  } else if (error instanceof Error) {
    // Handle generic JavaScript errors
    Alert.alert('Error', error.message);
  } else {
    // Fallback for unknown errors
    Alert.alert('Error', 'An unknown error occurred');
  }
};

// Type guard to check if the error is an AxiosError
function isAxiosError(error: unknown): error is AxiosError<ErrorResponse> {
  return (error as AxiosError).isAxiosError !== undefined;
}

export const useAuthHook = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const dispatch: AppDispatch = useDispatch();

  const sendLoginOtp = async (data: SendOtpData) => {
    try {
      const response = await SendOtp(data);
      console.log('otp', response?.data);
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const loginUser = async (data: LoginData) => {
    try {
      const response = await Login(data);
      console.log('login', response?.data);
      await AsyncStorage.setItem(
        'token',
        response?.data?.user?.authToken?.token,
      );
      await AsyncStorage.setItem('user', JSON.stringify(response?.data?.user));
      dispatch(storeCurrentUser(response?.data?.user));
      dispatch(storeToken(response?.data?.user?.authToken?.token));

      navigation.reset({
        index: 0,
        routes: [{ name: AuthCheckRoute }],
      });
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.clear();
      dispatch(clearGlobal());

      navigation.reset({
        index: 0,
        routes: [{ name: AuthCheckRoute }],
      });
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return { loginUser, sendLoginOtp, logoutUser };
};

export const useRestaurantHook = () => {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();

  async function getRestaurant(id: string) {
    try {
      const response = await GetRestaurant(id);
      console.log('restaurant id', response?.data);
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  }
  async function getRestaurants() {
    try {
      dispatch(storeRestaurantLoading(true));
      const response = await GetRestaurants();
      console.log('restaurants', response?.data);
      dispatch(storeRestaurants(response?.data?.restaurants));
      dispatch(storeRestaurantLoading(false));
    } catch (error: unknown) {
      dispatch(storeRestaurantLoading(false));
      handleAxiosError(error);
    }
  }
  async function onBoardRestaurant(data: OnBoardRestaurantData) {
    try {
      const response = await OnBoardRestaurant(data);
      console.log('on board', response?.data);
      getRestaurants();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  }
  async function updateRestaurant(data: Restaurant) {
    try {
      const response = null;
      if (data?._id) {
        const response = await UpdateRestaurant(data, data?._id);
        console.log('restaurants', response?.data);
      }
      getRestaurants();
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    }
  }

  async function deleteRestaurant(id: string) {
    try {
      const response = await DeleteRestaurant(id);
      console.log('delete board', response?.data);
      getRestaurants();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  }
  function checkMenuArray(parsedMenu: any) {
    if (!Array.isArray(parsedMenu)) {
      let tempMenu: any[] = [];
      for (let key of Object.keys(parsedMenu)) {
        tempMenu = tempMenu.concat(checkMenuArray(parsedMenu[key]));
      }
      return tempMenu;
    }
    return parsedMenu;
  }
  async function menuToJSON(
    data: MenuToJsonData,
    menuItems: MenuItem[],
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>,
  ) {
    try {
      dispatch(storeImageApiLoading(true));

      const response = await MenuToJson(data);
      let parsedMenu = JSON.parse(
        response?.data?.data?.response?.candidates[0]?.content?.parts[0]?.text
          ?.replace(/\n/g, '')
          .replace(/\\\"/g, '"')
          .trim()
          .slice(7, -3),
      );
      if (parsedMenu?.menu) {
        parsedMenu = parsedMenu?.menu;
      }
      parsedMenu = checkMenuArray(parsedMenu);
      const menuNew: MenuItem[] = parsedMenu?.map(
        (item: MenuToJsonItem, index: number) => {
          return {
            name: item?.item ? item?.item : '',
            description: '',
            id: Date.now() + '-' + index,
            price: item?.price ? item?.price : '0',
            category: item?.category ? item?.category : 'other',
          };
        },
      );
      setMenuItems([...menuItems, ...menuNew]);
      // await updateRestaurant({
      //   ...params,
      //   menu: menuNew,
      // });
      Alert.alert('Success', 'Done Convertion');
      // getRestaurants();
      dispatch(storeImageApiLoading(false));
    } catch (error: any) {
      console.log(error);
      dispatch(storeImageApiLoading(false));
      Alert.alert('Error', 'Image Not Compatible');
    }
  }
  return {
    getRestaurant,
    onBoardRestaurant,
    getRestaurants,
    updateRestaurant,
    deleteRestaurant,
    menuToJSON,
  };
};
