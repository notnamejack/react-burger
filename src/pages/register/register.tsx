import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { useForm } from '@hooks/use-form';
import { useRegisterMutation } from '@services/auth/api';

export const RegisterPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { form, handleInputChange } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setValidationError('Заполните все поля');
      return;
    }

    setValidationError(null);
    void register({ name: form.name, email: form.email, password: form.password });
  };

  const errorText = validationError ?? (typeof error === 'string' ? error : undefined);

  return (
    <AuthLayout
      title="Регистрация"
      submitText="Зарегистрироваться"
      isLoading={isLoading}
      error={errorText}
      onSubmit={handleSubmit}
      links={
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
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
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        value={form.name}
        onChange={handleInputChange}
        disabled={isLoading}
        size="default"
      />
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
