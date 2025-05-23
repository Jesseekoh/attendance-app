import { AxiosError, isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { SignUpFormType } from '../../components/SignUpForm';
import { AppState, useStore } from '../appStore';
import { StateCreator } from 'zustand';
import { api } from '../../api/axiosClient';
import { redirect } from 'react-router';
export const createAuthSlice: StateCreator<AppState> = (set) => ({
  user: null,
  signIn: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (response.status === 200) {
        toast.success('Log in successful');
        return response.data.data.user;
      } else {
        return null;
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error('User not found');
        }
      } else {
        toast.error('Failed to log in');
      }
      console.log(error);
      return null;
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

  // get
  fetchUser: async () => {
    return api
      .get('/users/me')
      .then((resp) => {
        console.log('Getting user');
        return resp.data.data;
      })
      .catch(() => {
        return null;
      });
  },
  updateUser: (user: AppState['user']) => set(() => ({ user })),
});
