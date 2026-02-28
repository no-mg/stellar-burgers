import {
  Middleware,
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload
} from '@reduxjs/toolkit';

type TWSActions<T> = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;
  wsConnecting: ActionCreatorWithoutPayload;
  wsOpen: ActionCreatorWithoutPayload;
  wsClose: ActionCreatorWithoutPayload;
  wsError: ActionCreatorWithPayload<string>;
  wsMessage: ActionCreatorWithPayload<T>;
};

export const createSocketMiddleware =
  <T>(actions: TWSActions<T>): Middleware =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;

      if (actions.wsConnect.match(action)) {
        socket = new WebSocket(action.payload);
        dispatch(actions.wsConnecting());

        socket.onopen = () => {
          dispatch(actions.wsOpen());
        };

        socket.onerror = () => {
          dispatch(actions.wsError('Ошибка WebSocket'));
        };

        socket.onmessage = (event) => {
          const data: T = JSON.parse(event.data);
          dispatch(actions.wsMessage(data));
        };

        socket.onclose = () => {
          dispatch(actions.wsClose());
        };
      }

      if (actions.wsDisconnect.match(action)) {
        socket?.close();
      }

      return next(action);
    };
  };