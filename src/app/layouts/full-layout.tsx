import { Outlet } from 'react-router-dom';
import { withAuth } from '../shared/hocs/with-auth';

interface FullLayoutProps {
  isAuthenticated?: boolean;
}

export const FullLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const AuthenticatedFullLayout = withAuth<FullLayoutProps>(FullLayout);
export default AuthenticatedFullLayout;
