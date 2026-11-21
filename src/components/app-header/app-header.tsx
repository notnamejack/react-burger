import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

import { selectUser } from '@services/auth/slice';
import { useSelector } from '@services/store';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={({ isActive }: { isActive: boolean }): string =>
              `${styles.link}${isActive ? ` ${styles.link_active}` : ''}`
            }
          >
            <BurgerIcon type="secondary" />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }: { isActive: boolean }): string =>
              `${styles.link} ml-10${isActive ? ` ${styles.link_active}` : ''}`
            }
          >
            <ListIcon type="secondary" />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
        <NavLink
          to="/profile"
          className={({ isActive }: { isActive: boolean }): string =>
            `${styles.link} ${styles.link_position_last}${isActive ? ` ${styles.link_active}` : ''}`
          }
        >
          <ProfileIcon type="secondary" />
          <p className="text text_type_main-default ml-2">
            {user?.name ?? 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
