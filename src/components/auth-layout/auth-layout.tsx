import { Button } from '@krgaa/react-developer-burger-ui-components';

import styles from './auth-layout.module.css';

type TAuthLayoutProps = {
  title: string;
  submitText: string;
  isLoading?: boolean;
  error?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  links: React.ReactNode;
};

export const AuthLayout = ({
  title,
  submitText,
  isLoading = false,
  error,
  onSubmit,
  children,
  links,
}: TAuthLayoutProps): React.JSX.Element => {
  return (
    <section className={styles.page}>
      <div className={styles.body}>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <h1 className="text text_type_main-medium">{title}</h1>
          {children}
          {error && (
            <p className={`${styles.error} text text_type_main-default`}>{error}</p>
          )}
          <Button htmlType="submit" type="primary" size="large" disabled={isLoading}>
            {submitText}
          </Button>
        </form>
        <div className={styles.links}>{links}</div>
      </div>
    </section>
  );
};
