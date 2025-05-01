import { FormikErrors, FormikTouched, FormikValues } from "formik";
import { useState } from "react";

interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray"; // Added prop to toggle color theme
  hint?: string;
  className?: string;
  errors?: FormikErrors<FormikValues>;
  values?: FormikValues;
  touched?: FormikTouched<Record<string, boolean>>;
  name: string;
  labelStartIcon?: React.ReactNode;
  labelEndIcon?: React.ReactNode;
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked,
  disabled = false,
  onChange,
  color = "blue", // Default to blue color
  hint,
  errors,
  touched,
  name,
  className,
  labelStartIcon,
  labelEndIcon,
  values,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked ?? values?.[name]);

  const handleToggle = () => {
    if (disabled) return;
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  const switchColors =
    color === "blue"
      ? {
          background: isChecked
            ? "bg-brand-500 "
            : "bg-gray-200 dark:bg-white/10", // Blue version
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        }
      : {
          background: isChecked
            ? "bg-gray-800 dark:bg-white/10"
            : "bg-gray-200 dark:bg-white/10", // Gray version
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };

  return (
    <>
      <label
        className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400 $"
        } ${className}`}
        onClick={handleToggle} // Toggle when the label itself is clicked
      >
        <span className="flex gap-x-2">
          {labelStartIcon} {label} {labelEndIcon}
        </span>
        <div className="relative">
          <div
            className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
              disabled
                ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
                : switchColors.background
            }`}
          ></div>
          <div
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
          ></div>
        </div>
      </label>
      {hint ||
        (errors && touched && name && errors[name] && touched[name] && (
          <p className="mt-1 text-xs text-error-500 dark:text-error-400">
            {typeof errors[name] === "string" ? errors[name] : null}
          </p>
        ))}
    </>
  );
};

export default Switch;
