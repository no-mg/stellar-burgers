import { createAction } from '@reduxjs/toolkit';

export const ordersWsConnect = createAction<string>('orders/wsConnect');
export const ordersWsDisconnect = createAction('orders/wsDisconnect');
export const ordersWsConnecting = createAction('orders/wsConnecting');
export const ordersWsOpen = createAction('orders/wsOpen');
export const ordersWsClose = createAction('orders/wsClose');
export const ordersWsError = createAction<string>('orders/wsError');
export const ordersWsMessage = createAction<any>('orders/wsMessage');