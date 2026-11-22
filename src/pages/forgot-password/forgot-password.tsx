import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { useForm } from '@hooks/use-form';
import { useForgotPasswordMutation } from '@services/auth/api';
import { RESET_PASSWORD_FLAG } from '@utils/api';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { form, handleInputChange } = useForm({
    email: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!form.email) {
      setValidationError('Заполните все поля');
      return;
    }

    setValidationError(null);
    void forgotPassword({ email: form.email })
      .unwrap()
      .then(() => {
        localStorage.setItem(RESET_PASSWORD_FLAG, 'true');
        void navigate('/reset-password');
      })
      .catch(() => undefined);
  };

  const errorText = validationError ?? (typeof error === 'string' ? error : undefined);

  return (
    <AuthLayout
      title="Восстановление пароля"
      submitText="Восстановить"
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
      <EmailInput
        name="email"
        placeholder="Укажите e-mail"
        value={form.email}
        onChange={handleInputChange}
        disabled={isLoading}
      />
    </AuthLayout>
  );
};
