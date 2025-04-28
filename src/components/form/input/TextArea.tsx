import React from "react";
import Label from "../Label";
import { FormikErrors, FormikTouched, FormikValues } from "formik";

interface TextareaProps {
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement> )=> void;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  autoComplete?: string;
  isRequired?: boolean;
  label: string;
  values?: FormikValues;
  errors?: FormikErrors<FormikValues>;
  touched?: FormikTouched<Record<string, boolean>>;
  labelClassName?: string;
  className?: string;
}

const TextArea: React.FC<TextareaProps> = ({
  rows = 3,
  value = "",
  onChange,
  onBlur,
  className = "",
  disabled = false,
  error = false,
  hint = "",
  name,
  autoComplete,
  isRequired,
  label,
  placeholder = `Enter your ${label}`,
  errors,
  touched,
  values,
  labelClassName,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>);
    }
  };

  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className} `;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (errors && touched && name && errors[name] && touched[name]) {
    textareaClasses += ` bg-transparent  border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
  } else {
    textareaClasses += ` bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <>
      <Label className={labelClassName}>
        {label}
        {isRequired && <span className="text-error-500">*</span>}
      </Label>
      <div className="relative">
        <textarea
          placeholder={placeholder}
          rows={rows}
          value={!value ? (name && values ? values[name] : "") : value}
          onChange={handleChange}
          disabled={disabled}
          className={textareaClasses}
          onBlur={onBlur}
          id="message"
          name={name}
          autoComplete={autoComplete}
          required={isRequired}
          aria-label={`${label}_area_label`}
        />
        {hint && (
          <p
            className={`mt-2 text-sm ${
              error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    </>
  );
};

export default TextArea;
