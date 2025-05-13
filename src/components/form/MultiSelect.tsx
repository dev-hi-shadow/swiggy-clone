import { FormikErrors, FormikTouched, FormikValues } from "formik";
import type React from "react";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

interface Option {
  value: string | number;
  label: string;
  text?: string | number;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: (string | number)[]) => void;
  disabled?: boolean;
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
  type?: "Number" | "String";
  isRequired?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  values,
  isRequired = false,
  name,
  label,
  options,
  defaultSelected = values ? values[name] : [],
  onChange,
  disabled = false,
  setFieldValue,
  type = "String",
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<(string | number)[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(
      newSelectedOptions.map((value) =>
        type === "Number" ? Number(value) : String(value)
      )
    );
    onChange?.(newSelectedOptions.map(String));
    if (setFieldValue) setFieldValue(name, newSelectedOptions);
  };

  const removeOption = (value: string | number) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
    if (setFieldValue) {
      setFieldValue(name, newSelectedOptions);
    }
  };

  const selectedValuesText = selectedOptions.map(
    (value) => options.find((option) => option.value === value)?.text ?? ""
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideClick(wrapperRef, () => {
    if (isOpen) setIsOpen(false);
  });
  // Calculate visible tags and overflow count
  const maxVisibleTags = 2; // Show maximum 2 tags before showing counter
  const visibleTags = selectedValuesText.slice(0, maxVisibleTags);
  const hiddenCount = selectedValuesText.length - maxVisibleTags;

  return (
    <div ref={wrapperRef} className="w-full relative">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}{isRequired ? <span className="text-error-500">*</span> : ""}
      </label>

      <div className="relative">
        <div
          onClick={toggleDropdown}
          className={`flex h-11 items-center rounded-lg border border-gray-300 py-1.5 pl-3 pr-3 shadow-theme-xs transition-all ${
            isOpen
              ? "border-brand-300 ring-2 ring-brand-200 dark:border-brand-300 dark:ring-brand-700"
              : "hover:border-gray-400 dark:hover:border-gray-600"
          } dark:border-gray-700 dark:bg-gray-900 cursor-pointer`}
        >
          <div className="flex flex-1 flex-wrap gap-2 overflow-hidden">
            {visibleTags.map((text, index) => (
              <div
                key={index}
                className="flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-sm text-gray-800 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              >
                <span className="max-w-[120px] truncate">{text}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(selectedOptions[index]);
                  }}
                  className="ml-1.5 -mr-1 text-gray-500 hover:text-gray-600 dark:text-gray-400"
                >
                  ×
                </button>
              </div>
            ))}

            {hiddenCount > 0 && (
              <div className="flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                +{hiddenCount} more
              </div>
            )}

            {selectedValuesText.length === 0 && (
              <span className="sm:text-xs md:text-base text-gray-500 dark:text-gray-400">
                Select options...
              </span>
            )}
          </div>

          {/* Chevron icon */}
          <div className="ml-2 flex-shrink-0">
            <svg
              className={`h-5 w-5 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              } text-gray-500 dark:text-gray-400`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Dropdown list */}
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 z-50">
            <div className="max-h-60 overflow-y-auto no-scrollbar rounded-md border border-gray-200 dark:border-gray-700">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value as string)}
                  className={`relative cursor-pointer select-none px-4 py-2 text-gray-900 transition-colors
                     ${
                       selectedOptions.includes(option.value as string)
                         ? "bg-brand-100/50 dark:bg-brand-900/20"
                         : "hover:bg-gray-100 dark:hover:bg-gray-700"
                     }
                     dark:text-white`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.value as string)}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600"
                    />
                    <span className="ml-3 block truncate">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
