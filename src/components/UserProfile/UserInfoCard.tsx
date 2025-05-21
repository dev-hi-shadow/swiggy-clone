import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { IUser } from "../../types";
import moment from "moment";
import Select from "../form/Select";
import { LanguagePreferences } from "../../constants";
import _ from "lodash";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { usePutMutation } from "../../services/Apis";
import { invalidateRoutes } from "../../utils";
import { setUser } from "../../services/Slices/authSlice";
import { useDispatch } from "react-redux";
import { Dispatch, SetStateAction } from "react";
interface IProps {
  userDetails?: Partial<IUser> | null;
  setUserDetails: Dispatch<SetStateAction<IUser | undefined>>;
}

const validationSchema = Yup.object().shape({
  first_name: Yup.string().label("First Name").required(),
  last_name: Yup.string().label("Last Name").nullable(),
  email: Yup.string().label("Email").required(),
  phone: Yup.string().label("Phone").required(),
  aadhar_card: Yup.string().label("Aadhar Card").required(),
  pan_card: Yup.string().label("Pan Card").required(),
  voter_id: Yup.string().label("Voter Id").required(),
  facebook: Yup.string().label("Facebook").nullable(),
  x: Yup.string().label("X").nullable(),
  linkedin: Yup.string().label("LinkedIn").nullable(),
  instagram: Yup.string().label("Instagram").nullable(),
  language_preference: Yup.string()
    .label("Language Preference")
    .default(LanguagePreferences.EN),
});
const fields: (keyof IUser)[] = [
  "language_preference",
  "id",
  "first_name",
  "last_name",
  "email",
  "phone",
  "aadhar_card",
  "pan_card",
  "voter_id",
  "facebook",
  "x",
  "linkedin",
  "instagram",
  "phone",
  "dob",
];

export default function UserInfoCard({ userDetails, setUserDetails }: IProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const [mutate] = usePutMutation();

  const handleSave = async (values: FormikValues) => {
    const { data } = await mutate({
      endpoint: `/users/${userDetails?.id}`,
      body: values,
      invalidateQueries: invalidateRoutes(`/users/${userDetails?.id}`),
    });
    if (data?.data?.data) {
      setUserDetails(data.data?.data as IUser);
      dispatch(setUser(data.data?.data as IUser));
      closeModal();
    }
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleBlur,
    handleReset,
    handleSubmit,
  } = useFormik({
    initialValues: _.defaults(
      _.pick(userDetails, fields),
      Object.fromEntries(fields.map((field) => [field, null]))
    ),
    validationSchema,
    onSubmit: handleSave,
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: true,
  });
  const handleCloseModal = (e?: unknown) => {
    closeModal();
    handleReset(e);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.first_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.phone}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                City
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.city}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                State/Country
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.state}/{userDetails?.country}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Aadharcard Number
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.aadhar_card}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Voter Id Number
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.voter_id}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Pancard Number
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.pan_card}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Verified by Swiggy
              </p>
              <p
                className={`text-sm font-medium ${
                  !userDetails?.is_verified
                    ? "text-error-500 "
                    : "text-success-500"
                }`}
              >
                {userDetails?.is_verified || "Unverified"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Language Preference
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {_.upperCase(userDetails?.language_preference as string)}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Date of Birth
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userDetails?.dob &&
                  moment(userDetails?.dob).format("DD-MM-YYYY")}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => handleCloseModal(undefined)}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Input
                      isRequired
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="first_name"
                      label="First Name"
                      type="text"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      label="Last Name"
                      name="last_name"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input
                      isRequired
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Email Address"
                      type="text"
                      name="email"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input
                      isRequired
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="phone"
                      label="Phone"
                      type="text"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input
                      isRequired
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="aadhar_card"
                      label="Aadharcard Number"
                      type="text"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input
                      isRequired
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="pan_card"
                      label="Pancard Number"
                      type="text"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Input
                      isRequired
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="voter_id"
                      label="Voter Id Number"
                      type="text"
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Select
                      name="language_preference"
                      values={values}
                      errors={errors}
                      defaultValue={values?.language_preference as string}
                      touched={touched}
                      label="Language Preference"
                      isRequired
                      onChange={(value) =>
                        setFieldValue("language_preference", value)
                      }
                      options={_.entries(LanguagePreferences).map(
                        ([key, value]) => ({
                          value,
                          label: key,
                        })
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Facebook"
                      type="text"
                      name="facebook"
                    />
                  </div>

                  <div>
                    <Input
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="X.com"
                      type="text"
                      name="x"
                    />
                  </div>

                  <div>
                    <Input
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Linkedin"
                      type="text"
                      name="linkedin"
                    />
                  </div>

                  <div>
                    <Input
                      values={values}
                      errors={errors}
                      touched={touched}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Instagram"
                      type="text"
                      name="instagram"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCloseModal(undefined)}
              >
                Close
              </Button>
              <Button type="submit" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
