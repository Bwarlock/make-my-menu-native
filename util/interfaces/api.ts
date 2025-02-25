import { AxiosResponse } from 'axios';

export type ErrorResponse = {
  message: string;
};
export type LoginData = {
  email: string;
  rememeberMe?: boolean;
  otp: string;
};

// should be provided By Backend
export type User = {
  email: string;
  phoneNumber: number;
  isOnHold: boolean;
  authToken: {
    token: string;
    expires: Date;
  };
  loginToken: {
    otp: string;
    expires: Date;
  };
  lastLogin: Date;
};

export type LoginResponse = Promise<
  AxiosResponse<
    {
      user: User;
    },
    ErrorResponse
  >
>;

export type SendOtpData = {
  email: string;
  rememeberMe?: boolean;
};

export type SendOtpResponse = Promise<
  AxiosResponse<
    {
      message: string;
    },
    ErrorResponse
  >
>;

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
};

// should be provided By Backend
export type Restaurant = {
  _id: string;
  user?: string;
  subDomain: string;
  restaurantName: string;
  address?: string;
  menu: MenuItem[];
  activeTemplate?: string;
  isActive?: boolean;
};

export type OnBoardRestaurantData = {
  subDomain: string;
  restaurantName: string;
  address: string;
};

export type OnBoardRestaurantResponse = Promise<
  AxiosResponse<
    {
      restaurant: Restaurant;
      success: boolean;
    },
    ErrorResponse
  >
>;

export type GetRestaurantResponse = Promise<
  AxiosResponse<
    {
      restaurant: Restaurant;
      success: boolean;
    },
    ErrorResponse
  >
>;

export type UpdateRestaurantResponse = Promise<
  AxiosResponse<
    {
      restaurant: Restaurant;
      success: boolean;
    },
    ErrorResponse
  >
>;

export type GetMyRestaurantsResponse = Promise<
  AxiosResponse<
    {
      restaurants: Restaurant[];
      success: boolean;
    },
    ErrorResponse
  >
>;

export type DeleteRestaurantResponse = Promise<
  AxiosResponse<
    {
      message: string;
      success: boolean;
    },
    ErrorResponse
  >
>;

export type MenuToJsonData = { baseImage: string };
export type MenuToJsonResponse = Promise<
  AxiosResponse<
    {
      data: {
        response: {
          candidates: {
            content: {
              parts: {
                text: string;
              }[];
            };
          }[];
        };
      };
      success: boolean;
    },
    ErrorResponse
  >
>;
export type MenuToJsonItem = {
  item: string;
  price: string;
  category: string;
};
