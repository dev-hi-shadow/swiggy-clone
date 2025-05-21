import { FormikErrors, FormikTouched, FormikValues } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// @ts-expect-error Swiper types are not up-to-date
import "swiper/css/navigation";
// @ts-expect-error Swiper types are not up-to-date
import "swiper/css";
// @ts-expect-error Swiper types are not up-to-date
import "swiper/css/pagination";
import _ from "lodash";

interface IProps {
  className?: string;
  onDrop?: (acceptedFiles: File[]) => void;
  setFieldTouched?: (name: string, touched?: boolean) => void;
  setFieldError?: (field: string, value: string | undefined) => void;
  setFieldValue?: (
    field: string,
    value: (string | File)[] | string | File
  ) => void;
  values?: FormikValues;
  errors?: FormikErrors<FormikValues>;
  touched?: FormikTouched<Record<string, boolean>>;
  name: string;
  isRequired?: boolean;
  label?: string;
  multiple?: boolean;
}

const DropzoneComponent: React.FC<IProps> = (props) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (props.onDrop) {
        props.onDrop(acceptedFiles);
      } else if (props.setFieldValue) {
        const currentFiles = props.values?.[props.name] ?? [];
        // If multiple is false, only take the first file; otherwise, append all
        const newFiles = props.multiple
          ? [...currentFiles, ...acceptedFiles]
          : acceptedFiles.slice(0, 1); // Limit to one file if multiple is false

        props.setFieldValue(props.name, newFiles);
      }

      if (props.setFieldTouched) {
        props.setFieldTouched(props.name, true);
      }
    },
    [props]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    multiple: props.multiple ?? true, // Use multiple prop to control file selection
  });

  useEffect(() => {
    const filesOrUrls = _.castArray(props.values?.[props.name] || []);
    const urls = _.map(filesOrUrls, (item) =>
      _.isString(item) ? item : URL.createObjectURL(item)
    );

    // If multiple is false, only keep the first preview
    setPreviews(props.multiple ? urls : urls.slice(0, 1));

    return () => {
      _.forEach(urls, (url) => {
        if (_.startsWith(url, "blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [props.values, props.name, props.multiple]);

  const handleRemove = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (props.setFieldValue && props.values) {
      const currentValues: Array<File | string> = _.castArray(
        props.values[props.name]
      );

      const removed = currentValues.splice(index, 1);
      if (typeof removed[0] !== "string") {
        URL.revokeObjectURL(URL.createObjectURL(removed[0]));
      }

      props.setFieldValue(props.name, currentValues);
    }
  };

  return (
    <div {...getRootProps()}>
      <div
        className={
          "flex justify-center flex-col transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 " +
          (props.className || "")
        }
      >
        <div
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
            isDragActive
              ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }`}
        >
          <input {...getInputProps()} />

          {previews.length > 0 ? (
            <div className="relative h-full w-full">
              {previews.length === 1 || !props.multiple ? (
                <div className="relative w-full">
                  <img
                    src={previews[0]}
                    className="h-59 w-full object-contain"
                    alt="Preview"
                  />
                  <span
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    onClick={(e) => handleRemove(0, e)}
                  >
                    ×
                  </span>
                </div>
              ) : (
                <>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation={{
                      prevEl: ".custom-prev-button",
                      nextEl: ".custom-next-button",
                    }}
                    pagination={{ clickable: true }}
                    className="h-64"
                  >
                    {previews.map((preview, index) => (
                      <SwiperSlide key={preview}>
                        <div className="relative h-full w-full">
                          <img
                            src={preview}
                            className="h-full w-full object-contain"
                            alt={`Preview ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={(e) => handleRemove(index, e)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      className="custom-prev-button bg-gray-200 p-2 rounded text-gray-700 hover:bg-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="custom-next-button bg-gray-200 p-2 rounded text-gray-700 hover:bg-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="dz-message flex flex-col items-center m-0!">
              <div className="mb-[22px] flex justify-center">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <svg
                    className="fill-current"
                    width="29"
                    height="28"
                    viewBox="0 0 29 28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                    />
                  </svg>
                </div>
              </div>

              <h4 className="mb-3 text-center font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                {isDragActive
                  ? `Drop ${
                      props.label ?? (props.multiple ? "Files" : "File")
                    } `
                  : `Drag & Drop ${
                      props.label ?? (props.multiple ? "Files" : "File")
                    }`}
              </h4>

              <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                {`Drag and drop your ${
                  props.multiple
                    ? "PNG, JPG, WebP, SVG images"
                    : "PNG, JPG, WebP, or SVG image"
                } here or browse`}
              </span>

              <span className="font-medium underline text-theme-sm text-brand-500">
                Browse {props.multiple ? "Files" : "File"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropzoneComponent;
