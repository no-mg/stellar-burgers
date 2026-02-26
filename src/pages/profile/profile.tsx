import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser, updateUser } from '../../services/slices/userSlice';
import { useLocation } from 'react-router-dom';

import { ProfileMenu } from '../../components/profile-menu/profile-menu';
import { ProfileOrders } from '../profile-orders';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const location = useLocation();

  const isOrdersPage = location.pathname.includes('/profile/orders');

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password || undefined
      })
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '60px',
        maxWidth: '1240px',
        margin: '120px auto 0'
      }}
    >
      <div style={{ width: '320px' }}>
        <ProfileMenu />
      </div>

      <div style={{ flex: 1 }}>
        {isOrdersPage ? (
          <ProfileOrders />
        ) : (
          <ProfileUI
            formValue={formValue}
            isFormChanged={isFormChanged}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};