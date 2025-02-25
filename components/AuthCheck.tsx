import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppStackRoute,
  AuthStackRoute,
  RootStackNavigationProp,
} from '../util/routes';
import { useDispatch } from 'react-redux';
import { storeCurrentUser, storeToken } from '../store/globalSlice';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch } from '../store/store';

const AuthCheck = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        console.log(token, user);

        if (!token || !user) {
          // No token, navigate to AuthStackRoute
          navigation.replace(AuthStackRoute);
        } else {
          // Have both token and user
          dispatch(storeToken(token));
          dispatch(storeCurrentUser(JSON.parse(user)));
          navigation.replace(AppStackRoute);
        }
      } catch (e: any) {
        console.log('Error', e);
        Alert.alert('Error', e?.message);
      }
    };

    checkToken();
  }, [dispatch, navigation]);

  return null;
};

export default AuthCheck;
