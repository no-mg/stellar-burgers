import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TUser,
  TRegisterData,
  TLoginData,
  TAuthResponse
} from '../../utils/types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from '../store';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/register',
  async (data) => {
    const res = await registerUserApi(data);

    const accessToken = res.accessToken.replace('Bearer ', '');

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', accessToken);

    return res;
  }
);

export const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/login',
  async (data) => {
    const res = await loginUserApi(data);

    const accessToken = res.accessToken.replace('Bearer ', '');

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', accessToken);

    return res;
  }
);

export const getUser = createAsyncThunk<TUser, void>(
  'user/get',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch {
      return rejectWithValue('Ошибка');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: { email?: string; name?: string; password?: string }) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.user.isAuthChecked;

export default userSlice.reducer;
