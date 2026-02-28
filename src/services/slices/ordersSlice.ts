import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';
import {
  ordersWsConnecting,
  ordersWsOpen,
  ordersWsClose,
  ordersWsError,
  ordersWsMessage
} from '../ordersWsActions';

type TOrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null
};

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

      .addCase(ordersWsConnecting, (state) => {
        state.isLoading = true;
      })
      .addCase(ordersWsOpen, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(ordersWsClose, (state) => {
        state.isLoading = false;
      })
      .addCase(ordersWsError, (state, action) => {
        state.error = action.payload;
      })
      .addCase(ordersWsMessage, (state, action) => {
        state.orders = action.payload.orders;
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
