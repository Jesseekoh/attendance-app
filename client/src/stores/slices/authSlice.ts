import axios, { AxiosError } from 'axios';
import { SignUpFormType } from '../../components/SignUpForm';
import { AppState } from '../appStore';
import { StateCreator } from 'zustand';
import { api } from '../../api/axiosClient';
export const createAuthSlice: StateCreator<AppState> = (set) => ({
  user: null,
  signIn: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        set({ user: response.data.data.user });
        // setAccessToken(response.data.data.accessToken);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  signUp: async (credentials: SignUpFormType) => {
    console.log(credentials);
    try {
      const response = await api.post('/auth/register', credentials);

      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        return error.response?.data;
      }
    }
  },
});
