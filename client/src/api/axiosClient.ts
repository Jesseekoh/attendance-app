import axios from 'axios';
import { useStore } from '../stores/appStore';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { updateUser } = useStore.getState();
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        console.log('Unauthorized, redirecting to login...');
        updateUser(null);
        // logout logic or redirect
      } else if (status === 500) {
        console.log('Server error');
      } else {
        console.log(`Error status: ${status}`);
      }
    }

    return Promise.reject(error);
  }
);
