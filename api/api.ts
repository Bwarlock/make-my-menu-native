import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import { Alert } from 'react-native';
import {
  LoginData,
  LoginResponse,
  SendOtpData,
  SendOtpResponse,
  OnBoardRestaurantData,
  OnBoardRestaurantResponse,
  GetRestaurantResponse,
  Restaurant,
  UpdateRestaurantResponse,
  DeleteRestaurantResponse,
  GetMyRestaurantsResponse,
  MenuToJsonData,
  MenuToJsonResponse,
} from '../util/interfaces';

// const BASE_URL = 'https://5265-112-196-112-74.ngrok-free.app/api';
// const BASE_URL = 'http://localhost:8000/api';
const BASE_URL = 'http://192.168.14.181:8000/api';
// const BASE_URL = 'https://api.makemymenu.online/api';

export const BaseAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const AuthAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// AuthAxiosInstance.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       const err = error as Error;
//       Alert.alert('Error retrieving token', err?.message || 'Unknown error');
//     }
//     return config;
//   },
//   (error) => {
//     Alert.alert('Error', error?.message);
//     return Promise.reject(error);
//   }
// );

export function Login(data: LoginData): LoginResponse {
  return BaseAxiosInstance({
    method: 'post',
    url: '/user/login',
    data: data,
  });
}

export function SendOtp(data: SendOtpData): SendOtpResponse {
  return BaseAxiosInstance({
    method: 'post',
    url: '/user/send-login-otp',
    data: data,
  });
}

export function OnBoardRestaurant(
  data: OnBoardRestaurantData,
): OnBoardRestaurantResponse {
  return AuthAxiosInstance({
    method: 'post',
    url: '/restaurant',
    data: data,
  });
}

export function UpdateRestaurant(
  data: Restaurant,
  id: string,
): UpdateRestaurantResponse {
  return AuthAxiosInstance({
    method: 'put',
    url: `/restaurant/${id}`,
    data: data,
  });
}

export function GetRestaurant(id: string): GetRestaurantResponse {
  return AuthAxiosInstance({
    method: 'get',
    url: `/restaurant/${id}`,
  });
}

export function DeleteRestaurant(id: string): DeleteRestaurantResponse {
  return AuthAxiosInstance({
    method: 'delete',
    url: `/restaurant/${id}`,
  });
}

export function GetRestaurants(): GetMyRestaurantsResponse {
  return AuthAxiosInstance({
    method: 'get',
    url: '/restaurant',
  });
}

export function MenuToJson(data: MenuToJsonData): MenuToJsonResponse {
  return AuthAxiosInstance({
    method: 'post',
    url: '/restaurant/menu-to-json',
    data: data,
  });
}
