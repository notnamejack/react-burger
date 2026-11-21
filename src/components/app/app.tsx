import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient/ingredient';
import { LoginPage } from '@pages/login/login';
import { NotFoundPage } from '@pages/not-found/not-found';
import { ProfileOrdersPage } from '@pages/profile-orders/profile-orders';
import { ProfileLayout } from '@pages/profile/profile';
import { ProfilePage } from '@pages/profile/profile-form';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { checkUserAuth } from '@services/auth/actions';
import { useDispatch } from '@services/store';

import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TBackgroundState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as TBackgroundState | null)?.background;

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseIngredient = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Routes location={background ?? location}>
          <Route path="/" element={<Home />} />
          <Route path="/ingredients/:id" element={<IngredientPage />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute onlyUnAuth>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute onlyUnAuth>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute onlyUnAuth onlyReset>
                <ResetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfilePage />} />
            <Route path="orders" element={<ProfileOrdersPage />} />
          </Route>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseIngredient}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
