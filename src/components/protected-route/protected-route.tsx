import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/auth/slice';
import { useSelector } from '@services/store';
import { RESET_PASSWORD_FLAG } from '@utils/api';

import type { Location } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  onlyReset?: boolean;
  children: React.ReactNode;
};

type TFromState = {
  from?: Location;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  onlyReset = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <p className="text text_type_main-default">Загрузка...</p>;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as TFromState | null)?.from ?? '/';

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyReset && localStorage.getItem(RESET_PASSWORD_FLAG) !== 'true') {
    return <Navigate to="/forgot-password" replace />;
  }

  return <>{children}</>;
};
