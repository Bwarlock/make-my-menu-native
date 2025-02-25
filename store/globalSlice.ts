import { createSlice } from '@reduxjs/toolkit';
import { Restaurant, User } from '../util/interfaces';

const initialValue: {
  token: string;
  currentUser: User | {};
  restaurants: Restaurant[];
  restaurantLoading: boolean;
  imageApiLoading: boolean;
} = {
  token: '',
  currentUser: {},
  restaurants: [],
  restaurantLoading: false,
  imageApiLoading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState: initialValue,
  reducers: {
    storeCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    storeToken: (state, action) => {
      state.token = action.payload;
    },
    clearGlobal: (state) => {
      return { ...initialValue };
    },
    storeRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },
    storeRestaurantLoading: (state, action) => {
      state.restaurantLoading = action.payload;
    },
    storeImageApiLoading: (state, action) => {
      state.imageApiLoading = action.payload;
    },
  },
});

export const {
  storeCurrentUser,
  clearGlobal,
  storeToken,
  storeRestaurants,
  storeRestaurantLoading,
  storeImageApiLoading,
} = globalSlice.actions;
export default globalSlice.reducer;
