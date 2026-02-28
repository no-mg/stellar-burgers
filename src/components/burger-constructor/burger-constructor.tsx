import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  orderBurger,
  closeModal
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients, orderRequest, orderModalData } =
    useSelector((state) => state.burgerConstructor);

  const user = useSelector((state) => state.user.user);

  const onOrderClick = () => {
    if (!bun) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ids = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(orderBurger(ids));
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum, item) => sum + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={() => dispatch(closeModal())}
    />
  );
};