import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SignUpFormType } from '../components/SignUpForm';
// import { api } from '../api/axiosClient';
import { createAuthSlice } from './slices/authSlice';
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
  fetchUser: () => Promise<void>;
  updateUser: (user: AppState['user']) => void;
}

export const useStore = create<AppState>()(
  devtools(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    // persist(

    {
      name: 'auth-storage',
      // storage: createJSONStorage(() => ),
    }
    // )
  )
);
