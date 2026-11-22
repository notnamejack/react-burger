import { Link } from 'react-router-dom';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <section className={styles.page}>
      <p className="text text_type_digits-large">404</p>
      <p className="text text_type_main-medium">Страница не найдена</p>
      <Link to="/" className={`${styles.link} text text_type_main-default`}>
        На главную
      </Link>
    </section>
  );
};
