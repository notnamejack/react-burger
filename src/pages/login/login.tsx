import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { useForm } from '@hooks/use-form';
import { useLoginMutation } from '@services/auth/api';

export const LoginPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { form, handleInputChange } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setValidationError('Заполните все поля');
      return;
    }

    setValidationError(null);
    void login({ email: form.email, password: form.password });
  };

  const errorText = validationError ?? (typeof error === 'string' ? error : undefined);

  return (
    <AuthLayout
      title="Вход"
      submitText="Войти"
      isLoading={isLoading}
      error={errorText}
      onSubmit={handleSubmit}
      links={
        <>
          <p className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?{' '}
            <Button
              htmlType="button"
              type="secondary"
              size="medium"
              onClick={(): void => {
                void navigate('/register');
              }}
              disabled={isLoading}
            >
              Зарегистрироваться
            </Button>
          </p>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?{' '}
            <Button
              htmlType="button"
              type="secondary"
              size="medium"
              onClick={(): void => {
                void navigate('/forgot-password');
              }}
              disabled={isLoading}
            >
              Восстановить пароль
            </Button>
          </p>
        </>
      }
    >
      <EmailInput
        name="email"
        placeholder="E-mail"
        value={form.email}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      <PasswordInput
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleInputChange}
        disabled={isLoading}
      />
    </AuthLayout>
  );
};
