import { create } from 'zustand';
import { AxiosError } from 'axios';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { SignUpFormType } from '../components/SignUpForm';
import { api } from '../api/axiosClient';
import toast from 'react-hot-toast';
export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ApiResponseType {
  success: boolean;
  message: string;
  error: object;
}
export interface AppState {
  user?: UserType | null;
  accessToken?: string;
  refreshToken?: string;
  signIn: (credentials: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  signUp: (credentials: SignUpFormType) => Promise<ApiResponseType>;
}

type Action = {
  updateUser: (user: AppState['user']) => void;
};

export const useStore = create<AppState & Action>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        signIn: async ({
          email,
          password,
        }: {
          email: string;
          password: string;
        }) => {
          try {
            const response = await api.post('/auth/login', {
              email: email.trim(),
              password,
            });

            if (response.status === 200) {
              set({ user: response.data.data.user });
              toast.success('Log in successful');
              return true;
            } else {
              if (response.status === 404) {
                toast.error('User not found');
              } else {
                toast.error('Failed to log in');
              }
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
        updateUser: (user: AppState['user']) => set(() => ({ user })),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
