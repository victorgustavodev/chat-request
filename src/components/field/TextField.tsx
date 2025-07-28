import React from "react";

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
}

const TextField: React.FC<TextFieldProps> = ({
  MaxLength,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  disabled,
  iconLeft,
  iconRight,
  name,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700  mb-1">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border 
          bg-white 
          border-gray-300 
          focus-within:ring-2 ring-emerald-500 
          transition duration-200 ease-in-out`}
      >
        {iconLeft && <span className="text-gray-500">{iconLeft}</span>}
        <input
          maxLength={MaxLength}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`flex-1 bg-transparent outline-none 
            text-gray-800 
            placeholder-gray-400 
            text-sm sm:text-base`}
        />
        {iconRight && <span className="text-gray-500">{iconRight}</span>}
      </div>
    </div>
  );
};

export default TextField;
