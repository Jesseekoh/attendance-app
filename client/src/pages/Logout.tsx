import { Navigate, useLoaderData } from 'react-router';

const Logout = () => {
  const data = useLoaderData();

  if (data.success) {
    return <Navigate to="/signin" />;
  }

  console.log(data);
  return <div>Logout</div>;
};

export default Logout;
