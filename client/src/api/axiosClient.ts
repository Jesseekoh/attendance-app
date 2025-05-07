import axios from 'axios';
import { useStore } from '../stores/appStore';
import { redirect } from 'react-router';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { updateUser } = useStore.getState();
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        // logout logic or redirect
        updateUser(null);
        redirect('/signin');
      }
      // else if (status === 500) {
      //   console.log('Server error');
      // } else {
      //   console.log(`Error status: ${status}`);
      // }
    }

    return Promise.reject(error);
  }
);
