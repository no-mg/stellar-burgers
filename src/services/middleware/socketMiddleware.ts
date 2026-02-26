import { Middleware } from '@reduxjs/toolkit';

type TWSActions = {
  wsConnect: any;
  wsDisconnect: any;
  wsConnecting: any;
  wsOpen: any;
  wsClose: any;
  wsError: any;
  wsMessage: any;
};

export const createSocketMiddleware =
  (actions: TWSActions): Middleware =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action: any) => {
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
          const data = JSON.parse(event.data);
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