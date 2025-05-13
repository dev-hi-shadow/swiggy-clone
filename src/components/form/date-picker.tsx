import React, { useState } from "react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormikErrors, FormikTouched, FormikValues } from "formik";
import moment from "moment";
import { CalenderIcon, ClockIcon } from "../svgs";
import Label from "./Label";

type DatePickerMode = "single" | "multiple" | "range" | "time";

interface IDatePickerProps {
  label?: string;
  wrapperClass?: string;
  use12Hour?: boolean;
  mode?: DatePickerMode;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  excludeDates?: Date[];
  className?: string;
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void;
  values: FormikValues;
  value?: string | string[] | [string, string] | null; // Updated to string (UTC)
  errors?: FormikErrors<FormikValues>;
  touched?: FormikTouched<Record<string, boolean>>;
  name: string;
  required?: boolean;
}

const DatePicker = ({
  label,
  wrapperClass = "",
  mode = "single",
  dateFormat = "yyyy-MM-dd",
  minDate,
  maxDate,
  excludeDates,
  className = "",
  use12Hour = false,
  setFieldValue,
  value,
  values,
  errors,
  touched,
  name,
  required = false,
}: IDatePickerProps) => {
  const timeFormat = use12Hour ? "h:mm a" : "HH:mm";
  const finalDateFormat = mode === "time" ? timeFormat : dateFormat;

  // Initialize internalDates with normalized Date objects (date only) for multiple mode
  const initialDates = (() => {
    if (mode === "multiple") {
      const val: string[] = Array.isArray(values[name])
        ? values[name].filter((d: string) => moment.utc(d).isValid())
        : Array.isArray(value)
        ? value.filter((d: string) => moment.utc(d).isValid())
        : [];
      // Convert UTC strings to Date objects (local timezone for react-datepicker)
      return val.map((d: string) => moment.utc(d).local().startOf("day").toDate());
    }
    return [];
  })();
  const [internalDates, setInternalDates] = useState<Date[]>(initialDates);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize default values for Formik
  React.useEffect(() => {
    if (!values[name] && !value) {
      const defaultValue =
        mode === "multiple" ? [] : mode === "range" ? [null, null] : null;
      setFieldValue(name, defaultValue, false);
    }
  }, [name, setFieldValue, value, values, mode]);

  const CustomInput = React.forwardRef<
    HTMLDivElement,
    { value: string; onClick: () => void }
  >(({ value, onClick }, ref) => {
    let displayValue: string | React.JSX.Element = value;

    if (mode === "multiple" && Array.isArray(internalDates)) {
      const maxVisibleBadges = 1;
      const visibleDates = internalDates.slice(0, maxVisibleBadges);
      const hiddenCount = internalDates.length - maxVisibleBadges;

      displayValue = (
        <div className="flex flex-wrap gap-1.5">
          {internalDates.length === 0 ? (
            <span className="text-gray-400">Select dates...</span>
          ) : (
            <>
              {visibleDates.map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-sm text-gray-800 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                >
                  <span>{moment(d).format("DD MMM YYYY")}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const updatedDates = internalDates.filter(
                        (_, index) => index !== idx
                      );
                      setInternalDates(updatedDates);
                      setFieldValue(
                        name,
                        updatedDates.map((date) =>
                          moment(date).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
                        ),
                        true
                      ); // Store UTC strings
                    }}
                    className="ml-1.5 -mr-1 text-gray-500 hover:text-gray-600 dark:text-gray-400"
                  >
                    ×
                  </button>
                </div>
              ))}
              {hiddenCount > 0 && (
                <div className="flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  +{hiddenCount} others
                </div>
              )}
            </>
          )}
        </div>
      );
    } else if (mode === "range" && Array.isArray(values[name])) {
      const [start, end] = values[name];
      displayValue =
        start && end && moment.utc(start).isValid() && moment.utc(end).isValid()
          ? `${moment.utc(start).local().format("YYYY-MM-DD")} ~ ${moment
              .utc(end)
              .local()
              .format("YYYY-MM-DD")}`
          : "Select date range...";
    } else if (mode === "time") {
      displayValue = values[name]
        ? moment.utc(values[name]).local().format(timeFormat)
        : "Select time...";
    } else {
      displayValue = values[name]
        ? moment.utc(values[name]).local().format("ll")
        : "Select date...";
    }

    return (
      <div className="w-full relative">
        <div
          onClick={() => {
            setIsOpen(true);
            onClick();
          }}
          className={`w-full min-h-[42px] flex items-center flex-wrap gap-1 pl-4 pr-10 py-2 text-sm rounded-lg border ${
            errors?.[name] && touched?.[name]
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-theme-xs placeholder-gray-40038 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 ${className} cursor-pointer`}
          ref={ref}
        >
          {displayValue}
        </div>
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
          onClick={() => {
            setIsOpen(true);
            onClick();
          }}
        >
          {mode === "time" ? (
            <ClockIcon className="w-5 h-5" />
          ) : (
            <CalenderIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  });
  CustomInput.displayName = "CustomInput";

  const handleChange = (date: Date | [Date, Date] | Date[] | null): void => {
    if (mode === "range" && Array.isArray(date)) {
      const dateRange = date.map((d) =>
        d ? moment(d).utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : null
      ) as [string, string];
      setFieldValue(name, dateRange, true); // Store UTC strings
      if (dateRange[0] && dateRange[1]) {
        setIsOpen(false);
      }
    } else if (mode === "multiple" && date instanceof Date) {
      // Normalize selected date to start of day
      const normalizedDate = moment(date).startOf("day").toDate();
      const newInternalDates = [...internalDates];
      const isAlreadySelected = newInternalDates.some((d) =>
        moment(d).isSame(normalizedDate, "day")
      );

      if (isAlreadySelected) {
        // Remove the date if already selected
        const updatedDates = newInternalDates.filter(
          (d) => !moment(d).isSame(normalizedDate, "day")
        );
        setInternalDates(updatedDates);
        setFieldValue(
          name,
          updatedDates.map((d) =>
            moment(d).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
          ),
          true
        ); // Store UTC strings
      } else {
        // Add the new date
        newInternalDates.push(normalizedDate);
        setInternalDates(newInternalDates);
        setFieldValue(
          name,
          newInternalDates.map((d) =>
            moment(d).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
          ),
          true
        ); // Store UTC strings
      }
    } else {
      const selectedDate = date
        ? moment(date instanceof Date ? date : null).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
        : null;
      setFieldValue(name, selectedDate, true); // Store UTC string
      setIsOpen(false);
    }
  };

  const handleCalendarClose = () => {
    setIsOpen(false);
  };

  const commonProps = {
    customInput: <CustomInput value="" onClick={() => {}} />,
    showTimeSelect: mode === "time",
    showTimeSelectOnly: mode === "time",
    timeIntervals: 5,
    timeCaption: "Time",
    timeFormat: timeFormat,
    dateFormat: finalDateFormat,
    minDate,
    maxDate,
    excludeDates,
    popperClassName: "react-datepicker-dark",
    showPopperArrow: false,
    calendarClassName:
      "rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900",
    open: isOpen,
    onCalendarClose: handleCalendarClose,
  };

  return (
    <div className={`relative w-full ${wrapperClass}`}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-error-500">*</span>}
        </Label>
      )}

      {mode === "multiple" ? (
        <DatePickerLib
          {...commonProps}
          shouldCloseOnSelect={false}
          highlightDates={internalDates}
          selected={null}
          onChange={handleChange}
          key={internalDates.length} // Force re-render when internalDates changes
        />
      ) : mode === "range" ? (
        <DatePickerLib
          {...commonProps}
          shouldCloseOnSelect={false}
          selectsRange
          startDate={
            values[name]?.[0] && moment.utc(values[name][0]).isValid()
              ? moment.utc(values[name][0]).local().toDate()
              : null
          }
          endDate={
            values[name]?.[1] && moment.utc(values[name][1]).isValid()
              ? moment.utc(values[name][1]).local().toDate()
              : null
          }
          onChange={(date) => handleChange(date as [Date, Date])}
        />
      ) : (
        <DatePickerLib
          {...commonProps}
          shouldCloseOnSelect={true}
          selected={
            values[name] && moment.utc(values[name]).isValid()
              ? moment.utc(values[name]).local().toDate()
              : null
          }
          onChange={(date) => handleChange(date as Date)}
        />
      )}

      {errors?.[name] && touched?.[name] && (
        <div className="mt-1 text-sm text-error-500">
          {Array.isArray(errors?.[name])
            ? errors[name].join(", ")
            : typeof errors?.[name] === "string"
            ? errors[name]
            : null}
        </div>
      )}
    </div>
  );
};

export default DatePicker;