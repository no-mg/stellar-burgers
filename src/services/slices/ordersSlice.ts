import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

type TOrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
};

const initialState: TOrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false
};

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => {
    return await getOrdersApi();
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  }
});

export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;

export const { clearCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;