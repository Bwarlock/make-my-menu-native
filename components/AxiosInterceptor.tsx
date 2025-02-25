import { useEffect, useState, ReactNode } from "react";
import { AuthAxiosInstance } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthCheckRoute } from "../util/routes";
import { useAuthHook } from "../api/hooks";
import { Alert } from "react-native";
import {AxiosResponse,AxiosError} from "axios";

interface AxiosInterceptorProps {
  children: ReactNode;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const [isSet, setIsSet] = useState<boolean>(false);
  const { logoutUser } = useAuthHook();

  useEffect(() => {
    const reqIntercepter = AuthAxiosInstance.interceptors.request.use(
			async (config) => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          const err = error as Error;
          Alert.alert('Error retrieving token', err?.message || 'Unknown error');
        }
        return config;
      },
      (error) => {
        Alert.alert('Error', error?.message);
        return Promise.reject(error);
      }
		);

		const resInterceptor = AuthAxiosInstance.interceptors.response.use(
			(response: AxiosResponse) => {
				return response;
			},
			async (error: AxiosError) => {
				// Incase 401 Unauthorized , move the user to login , clear Storage
				if (error?.response && error.response.status === 401) {
						logoutUser();
				}
				return Promise.reject(error);
			}
		);
		console.log("Axios Interceptor set");
		setIsSet(true);
		return () => {
			AuthAxiosInstance.interceptors.request.eject(reqIntercepter);
			AuthAxiosInstance.interceptors.response.eject(resInterceptor);
		};
  }, []);

  return isSet ? <>{children}</> : null;
};

export default AxiosInterceptor;
