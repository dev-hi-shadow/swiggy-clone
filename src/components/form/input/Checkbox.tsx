import { FormikErrors, FormikTouched, FormikValues } from "formik";
import type React from "react";

interface CheckboxProps {
  label?: string | React.ReactNode;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name: string;
  errors?: FormikErrors<FormikValues>;
  touched?: FormikTouched<Record<string, boolean>>;
  isRequired?: boolean;
  setFieldTouched?: (name: string) => void;
  setFieldError?: (name: string) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  isRequired = false,
  onChange,
  className = "",
  disabled = false,
  errors,
  touched,
  name,
  setFieldTouched,
  setFieldError,
}) => {
  return (
    <div className="flex flex-col">
      <label
        className={`flex items-center space-x-3 group cursor-pointer ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <div className="relative w-5 h-5">
          <input
            id={id}
            type="checkbox"
            className={`w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60 
          ${className}`}
            checked={checked}
            onChange={(e) => {
              if (setFieldTouched) {
                setFieldTouched(name);
              }
              if (setFieldError && isRequired && !checked) {
                setFieldError(name);
              }
               onChange(e.target.checked);
            }}
            disabled={disabled}
          />
          {checked && (
            <svg
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="white"
                strokeWidth="1.94437"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {disabled && (
            <svg
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="#E4E7EC"
                strokeWidth="2.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {label && (
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {label}
          </span>
        )}
      </label>
      {errors && touched && touched[name] && errors[name] && (
        <span className="text-sm text-red-500">{String(errors[name])}</span>
      )}
    </div>
  );
};

export default Checkbox;
