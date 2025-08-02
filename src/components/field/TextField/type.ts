interface TextFieldProps {
  MaxLength?: number;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  name?: string;
  className?: string;
  error?: string;
}

export type { TextFieldProps };