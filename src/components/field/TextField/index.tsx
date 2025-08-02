import React, { useState, useRef } from "react";
import { TextFieldProps } from "./type";

const TextField: React.FC<TextFieldProps> = ({
  MaxLength,
  label,
  type = "text",
  placeholder = " ",
  value,
  onChange,
  required,
  disabled,
  iconLeft,
  iconRight,
  name,
  error,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatCPF = (val: string) =>
    val
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const formatPhone = (val: string) =>
    val
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

  const formatDate = (val: string) =>
    val
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4}).*/, "$1");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (type === "cpf") {
      newValue = formatCPF(newValue);
    } else if (type === "phone") {
      newValue = formatPhone(newValue);
    } else if (type === "birthdate") {
      newValue = formatDate(newValue);
    }

    onChange?.(newValue);
  };

  const isPassword = type === "password";
  const isCPF = type === "cpf";
  const isPhone = type === "phone";
  const isBirthdate = type === "birthdate";

  const inputType =
    isPassword && showPassword
      ? "text"
      : isCPF || isPhone || isBirthdate
      ? "text"
      : type;

  const hasValue = !!value && value.toString().length > 0;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border 
          bg-white border-gray-300 
          focus-within:ring-2 ring-emerald-500 
          transition duration-200 ease-in-out`}
      >
        {iconLeft && <span className="text-gray-500">{iconLeft}</span>}

        <input
          ref={inputRef}
          maxLength={MaxLength}
          type={inputType}
          name={name}
          placeholder={isFocused || hasValue ? placeholder : " "}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 bg-transparent outline-none 
            text-gray-800
            text-sm sm:text-base
          `}
          autoComplete="off"
          aria-label={label}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 focus:outline-none cursor-pointer"
            tabIndex={-1}
          >
            <img
              src={showPassword ? "/images/close-eye.svg" : "/images/eye.svg"}
              alt="Toggle senha"
              className="w-5 h-5"
            />
          </button>
        ) : (
          iconRight && <span className="text-gray-500">{iconRight}</span>
        )}
      </div>

      {label && (
        <label
          htmlFor={name}
          className={`
            absolute left-2 px-1 text-gray-500 text-sm 
            transition-all duration-200 ease-in-out
            pointer-events-none
            bg-white
            ${
              isFocused || hasValue
                ? "-top-3 text-xs font-medium text-emerald-600"
                : "top-3"
            }
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {error && (
        <span className="text-[12px] sm:text-sm text-red-500 mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextField;
