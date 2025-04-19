import { useLoaderData } from 'react-router';

const Logout = () => {
  const data = useLoaderData();

  console.log(data);
  return <div>Logout</div>;
};

export default Logout;
