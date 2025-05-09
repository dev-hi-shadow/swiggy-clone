import { useState } from "react";
import Label from "./Label";
import { FormikErrors, FormikTouched, FormikValues } from "formik";

export interface Option {
  value: string;
  label: string;
  text?: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: number | string;
  label: string;
  isRequired?: boolean;
  labelClassName?: string;
  setFieldTouched?: (name: string) => void;
  setFieldError?: (field: string, value: string | undefined) => void;
  values?: FormikValues;
  errors?: FormikErrors<FormikValues>;
  touched?: FormikTouched<Record<string, boolean>>;
  name: string;
  setFieldValue?: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue,
  isRequired = false,
  labelClassName,
  setFieldTouched,
  setFieldError,
  errors,
  touched,
  name,
  setFieldValue
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<
    string | number | undefined
  >(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setFieldTouched) {
      setFieldTouched(e.target.name);
    }
    if (setFieldError && isRequired && !selectedValue) {
      setFieldError(e.target.name, `${label} is required field`);
    }
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); // Trigger parent handler
    if (setFieldValue) setFieldValue(name, value);
  };

  return (
    <>
      <Label className={labelClassName}>
        {label}
        {isRequired && <span className="text-error-500">*</span>}
      </Label>
      <select
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          selectedValue
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        } ${className}`}
        value={selectedValue}
        onChange={handleChange}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
      {errors && touched && touched[name] && errors[name] && (
        <span className="text-sm text-error-500 mt-1.5">
          {String(errors[name])}
        </span>
      )}
    </>
  );
};

export default Select;
