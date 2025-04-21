import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../api/axiosClient';
import { useStore } from '../stores/appStore';

const Logout = () => {
  const { updateUser } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    const logout = () => {
      return api
        .post('/auth/logout')
        .then(() => {
          updateUser(null);
          navigate('/signin');
        })
        .catch((err) => {
          console.log(err);
          navigate('/');
        });
    };
    logout();
  }, []);
  return <div>Logout</div>;
};

export default Logout;
