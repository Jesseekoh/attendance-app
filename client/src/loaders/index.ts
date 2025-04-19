import axios from 'axios';
import { api } from '../api/axiosClient';
import { LoaderFunctionArgs, redirect } from 'react-router';

export async function classDetailsLoader({ params }: LoaderFunctionArgs) {
  const { classId } = params;
  try {
    const resp = await api.get('/classes/' + classId);
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log('redirecting...');
        return redirect('/signin');
      }
      const status = error.response?.status || 500;
      const message = error.response?.statusText || 'Unknown Error';
      throw new Response(message, { status, statusText: message });
    }
  }
}

export async function logOutLoader() {
  return api
    .post('/auth/logout')
    .then(() => redirect('/signup'))
    .catch(() => {
      throw new Error('Log out failed');
    });
}
