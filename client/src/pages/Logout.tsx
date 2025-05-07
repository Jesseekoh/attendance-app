import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../api/axiosClient';
import { useStore } from '../stores/appStore';

const Logout = () => {
  const { updateUser } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      try {
        await api.post('/auth/logout');
        updateUser(null);
        navigate('/signin');
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };
    logout();
  }, []);
  return <div>Logging Out</div>;
};

export default Logout;
