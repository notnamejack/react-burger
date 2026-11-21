import { Button } from '@krgaa/react-developer-burger-ui-components';
import { NavLink, Outlet } from 'react-router-dom';

import { useLogoutMutation } from '@services/auth/api';

import styles from './profile.module.css';

const navClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.link}${isActive ? ` ${styles.active}` : ''}`;

export const ProfileLayout = (): React.JSX.Element => {
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = (): void => {
    void logout();
  };

  return (
    <div className={styles.profile}>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          <li className={styles.item}>
            <NavLink to="/profile" end className={navClassName}>
              <span className="text text_type_main-medium text_color_inactive">
                Профиль
              </span>
            </NavLink>
          </li>
          <li className={styles.item}>
            <NavLink to="/profile/orders" className={navClassName}>
              <span className="text text_type_main-medium text_color_inactive">
                История заказов
              </span>
            </NavLink>
          </li>
          <li className={styles.item}>
            <Button
              htmlType="button"
              type="secondary"
              size="large"
              onClick={handleLogout}
              disabled={isLoading}
            >
              Выход
            </Button>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};
