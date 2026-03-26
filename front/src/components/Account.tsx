import { useCurrentUser } from '../context/UserContext';

const AccountPage = () => {
  const { user } = useCurrentUser();

  return <div>Bienvenue {user?.username}, je suis la Account Page !</div>;
};

export default AccountPage;
