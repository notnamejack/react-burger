import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { useForm } from '@hooks/use-form';
import { useResetPasswordMutation } from '@services/auth/api';
import { RESET_PASSWORD_FLAG } from '@utils/api';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { form, handleInputChange } = useForm({
    password: '',
    token: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!form.password || !form.token) {
      setValidationError('Заполните все поля');
      return;
    }

    setValidationError(null);
    void resetPassword({ password: form.password, token: form.token })
      .unwrap()
      .then(() => {
        localStorage.removeItem(RESET_PASSWORD_FLAG);
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  const errorText = validationError ?? (typeof error === 'string' ? error : undefined);

  return (
    <AuthLayout
      title="Восстановление пароля"
      submitText="Сохранить"
      isLoading={isLoading}
      error={errorText}
      onSubmit={handleSubmit}
      links={
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={(): void => {
              void navigate('/login');
            }}
            disabled={isLoading}
          >
            Войти
          </Button>
        </p>
      }
    >
      <PasswordInput
        name="password"
        placeholder="Введите новый пароль"
        value={form.password}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      <Input
        type="text"
        name="token"
        placeholder="Введите код из письма"
        value={form.token}
        onChange={handleInputChange}
        disabled={isLoading}
        size="default"
      />
    </AuthLayout>
  );
};
