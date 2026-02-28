import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  ordersWsConnect,
  ordersWsDisconnect
} from '../../services/ordersWsActions';
import { selectUserOrders } from '../../services/slices/ordersSlice';
import { getCookie } from '../../utils/cookie';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    const rawToken = getCookie('accessToken');
    if (!rawToken) return;

    const token = rawToken.replace('Bearer ', '');

    dispatch(
      ordersWsConnect(`wss://norma.education-services.ru/orders?token=${token}`)
    );

    return () => {
      dispatch(ordersWsDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
