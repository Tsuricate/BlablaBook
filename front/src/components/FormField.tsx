import { Box, Field, FieldErrorIcon, Input } from '@chakra-ui/react';
import { PasswordInput } from './ui/password-input';

type FormFieldProps = {
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'email' | 'password';
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const FormField = ({
  name,
  label,
  value,
  placeholder,
  error,
  type = 'text',
  onChange,
  onBlur,
}: FormFieldProps) => {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>

      {type === 'password' ? (
        <PasswordInput
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        <Input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}

      <Box minH={6}>
        <Field.ErrorText>
          <FieldErrorIcon />
          {error}
        </Field.ErrorText>
      </Box>
    </Field.Root>
  );
};

export default FormField;
