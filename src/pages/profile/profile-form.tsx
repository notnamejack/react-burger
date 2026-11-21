import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { useForm } from '@hooks/use-form';
import { useUpdateUserMutation } from '@services/auth/api';
import { selectUser } from '@services/auth/slice';
import { useSelector } from '@services/store';

import styles from './profile-form.module.css';

const PLACEHOLDER_PASSWORD = '123456789';

export const ProfilePage = (): React.JSX.Element | null => {
  const user = useSelector(selectUser);
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { form, handleInputChange, setForm } = useForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: PLACEHOLDER_PASSWORD,
  });

  useEffect(() => {
    if (isEdit) {
      return;
    }

    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: PLACEHOLDER_PASSWORD,
    });
  }, [user, isEdit, setForm]);

  if (!user) {
    return null;
  }

  const startEdit = (): void => {
    setIsPasswordVisible(false);
    setIsEdit(true);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
    });
  };

  const clearField = (name: 'name' | 'email'): void => {
    setForm((current) => ({
      ...current,
      [name]: '',
    }));
  };

  const handleCancel = (): void => {
    setIsPasswordVisible(false);
    setIsEdit(false);
    setForm({
      name: user.name,
      email: user.email,
      password: PLACEHOLDER_PASSWORD,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!form.name || !form.email) {
      return;
    }

    const password = form.password === PLACEHOLDER_PASSWORD ? '' : form.password;

    void updateUser({
      name: form.name,
      email: form.email,
      password,
    })
      .unwrap()
      .then(() => {
        setIsPasswordVisible(false);
        setIsEdit(false);
      })
      .catch(() => undefined);
  };

  const errorText = typeof error === 'string' ? error : undefined;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        value={form.name}
        onChange={handleInputChange}
        onIconClick={isEdit ? (): void => clearField('name') : startEdit}
        icon={isEdit ? 'CloseIcon' : 'EditIcon'}
        error={isEdit && form.name.length === 0}
        disabled={isLoading || !isEdit}
        errorText="Имя - не введёно"
        size="default"
        extraClass="ml-1"
      />
      <Input
        type="email"
        name="email"
        placeholder="E-mail"
        value={form.email}
        onChange={handleInputChange}
        onIconClick={isEdit ? (): void => clearField('email') : startEdit}
        icon={isEdit ? 'CloseIcon' : 'EditIcon'}
        error={isEdit && form.email.length === 0}
        disabled={isLoading || !isEdit}
        errorText="E-mail - не введён"
        size="default"
        extraClass="ml-1"
      />
      <Input
        type={isEdit && isPasswordVisible ? 'text' : 'password'}
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleInputChange}
        onIconClick={
          isEdit
            ? (): void => {
                setIsPasswordVisible((current) => !current);
              }
            : startEdit
        }
        icon={isEdit ? (isPasswordVisible ? 'HideIcon' : 'ShowIcon') : 'EditIcon'}
        error={false}
        disabled={isLoading || !isEdit}
        errorText="Пароль - не введён"
        size="default"
        extraClass="ml-1"
      />
      {errorText && (
        <p className={`${styles.error} text text_type_main-default text_color_inactive`}>
          {errorText}
        </p>
      )}
      {isEdit && (
        <div className={styles.actions}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
