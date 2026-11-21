import { useState } from 'react';

type TUseFormResult<TForm extends Record<string, string>> = {
  form: TForm;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
};

export const useForm = <TForm extends Record<string, string>>(
  inputValues: TForm
): TUseFormResult<TForm> => {
  const [form, setForm] = useState<TForm>(inputValues);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return { form, handleInputChange, setForm };
};
