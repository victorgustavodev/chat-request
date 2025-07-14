'use client';

import { useRef, useState } from 'react';

interface TextFieldProps {
  label?: string;
  type?: 'text' | 'password' | 'email' | 'phone' | 'cpf';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  icon?: React.ReactNode; // ícone que aparecerá à direita
  onChange?: (value: string) => void;
}

export default function TextField({
  label,
  type = 'text',
  placeholder,
  required,
  disabled,
  defaultValue,
  icon,
  onChange,
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(defaultValue || '');

  const inputType =
    type === 'password' && showPassword ? 'text' : (type === 'phone' || type === 'cpf' ? 'text' : type);
  const showFloatingLabel = isFocused || value;

  function formatCPF(value: string) {
    value = value.replace(/\D/g, '').slice(0, 11);
    return value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function formatPhone(value: string) {
    value = value.replace(/\D/g, '').slice(0, 11);

    if (value.length === 0) return '';
    if (value.length <= 2) return `(${value}`;
    if (value.length <= 6) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  }

  function formatValue(value: string) {
    if (type === 'cpf') return formatCPF(value);
    if (type === 'phone') return formatPhone(value);
    return value;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value;
    const onlyNumbers = rawValue.replace(/\D/g, '');
    const input = inputRef.current;
    const cursorPosition = input?.selectionStart || 0;

    let formattedValue = '';

    if (type === 'cpf' || type === 'phone') {
      formattedValue = formatValue(onlyNumbers);
      setValue(formattedValue);
      onChange?.(onlyNumbers);
    } else {
      formattedValue = rawValue;
      setValue(formattedValue);
      onChange?.(formattedValue);
    }

    setTimeout(() => {
      if (!input) return;
      let newCursorPosition = cursorPosition;

      if (type === 'phone') {
        const maskChars = ['(', ')', ' ', '-'];
        if (
          maskChars.includes(formattedValue.charAt(newCursorPosition - 1)) &&
          rawValue.length < value.length
        ) {
          newCursorPosition = newCursorPosition - 1;
        }
      }

      if (newCursorPosition < 0) newCursorPosition = 0;
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }

  return (
    <div className="relative w-full mt-4">
      {label && (
        <label
          htmlFor={label}
          className={`absolute left-3 px-1 bg-white z-10 transition-all duration-200 text-xs ${
            showFloatingLabel ? '-top-2 text-emerald-600' : 'top-2.5 text-gray-400'
          }`}
        >
          {label} {required && '*'}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={label}
          type={inputType}
          placeholder={showFloatingLabel ? placeholder : ''}
          required={required}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full text-base py-2 pr-10 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 text-gray-900 px-3`}
        />

        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 p-1"
            tabIndex={-1}
          >
            {showPassword ? (
              <img src="/eye.svg" alt="Esconder senha" className="w-4 h-4" />
            ) : (
              <img src="/close-eye.svg" alt="Mostrar senha" className="w-4 h-4" />
            )}
          </button>
        ) : (
          icon && (
            <div className='absolute right-2 p-1'>
            <div className="w-3 h-3 flex items-center justify-center">
              {icon}
            </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
