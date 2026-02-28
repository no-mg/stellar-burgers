import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import constructorReducer from './slices/constructorSlice';
import { createSocketMiddleware } from './middleware/socketMiddleware';
import {
  ordersWsConnect,
  ordersWsDisconnect,
  ordersWsConnecting,
  ordersWsOpen,
  ordersWsClose,
  ordersWsError,
  ordersWsMessage
} from './ordersWsActions';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const ordersMiddleware = createSocketMiddleware({
  wsConnect: ordersWsConnect,
  wsDisconnect: ordersWsDisconnect,
  wsConnecting: ordersWsConnecting,
  wsOpen: ordersWsOpen,
  wsClose: ordersWsClose,
  wsError: ordersWsError,
  wsMessage: ordersWsMessage
});

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    user: userReducer,
    feed: feedReducer,
    orders: ordersReducer,
    burgerConstructor: constructorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
