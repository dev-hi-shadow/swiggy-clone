import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { FormikValues, useFormik } from "formik";
import { IRBranch, IRestaurant, IUser } from "../../types";
import _ from "lodash";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import * as Yup from "yup";
import MultiSelect from "../../components/form/MultiSelect";
import { AppRoutes } from "../../constants";
import {
  useCreateRBranchMutation,
  useUpdateRBranchMutation,
} from "../../services/api-hooks/branchHooks";
import Select, { Option } from "../../components/form/Select";
import { useGetRestaurants } from "../../services/api-hooks/restaurantsHook";
import { useGetUsers } from "../../services/api-hooks/usersHook";
import { TimeIcon } from "../../icons";

const fields: (keyof IRBranch)[] = [
  "id",
  "restaurant_id",
  "manager_id",
  "location",
  "longitude",
  "latitude",
  "image",
  "email",
  "phone_number",
  "alternate_phone_number",
  "expected_delivery_time",
  "average_price_for_one",
  "average_price_for_two",
  "delivery_charge",
  "min_order_value",
  "max_order_value",
  "is_open",
  "is_available_for_delivery",
  "is_available_for_pickup",
  "is_veg_only",
  "opening_time",
  "closing_time",
  "special_opening_time",
  "special_closing_time",
  "average_preparation_time",
  "slug",
  "short_description",
  "full_description",
  "gst_number",
  "fssai_license_number",
  "service_radius_km",
  "cancellation_policy",
  "timezone",
];

const validationSchema = Yup.object().shape({
  id: Yup.string().label("ID"),
  restaurant_id: Yup.string()
    .required("Restaurant is required")
    .label("Restaurant"),
  manager_id: Yup.string().required().label("Manager"),
  location: Yup.string().required().label("Location"),
  longitude: Yup.string().label("Longitude"),
  latitude: Yup.string().label("Latitude"),
  image: Yup.string().label("Image"),
  email: Yup.string().label("Email"),
  phone_number: Yup.string().label("Phone Number").required(),
  alternate_phone_number: Yup.string().label("Alternate Phone Number"),
  expected_delivery_time: Yup.string()
    .required()
    .label("Expected Delivery Time"),
  average_price_for_one: Yup.string().label("Average Price For One"),
  average_price_for_two: Yup.string().label("Average Price For Two"),
  delivery_charge: Yup.string().label("Delivery Charge"),
  min_order_value: Yup.string().label("Min Order Value"),
  max_order_value: Yup.string().label("Max Order Value"),
  is_open: Yup.string().label("Is Open").required(),
  is_available_for_delivery: Yup.string()
    .label("Is Available For Delivery")
    .required(),
  is_available_for_pickup: Yup.string()
    .label("Is Available For Pickup")
    .required(),
  is_veg_only: Yup.string().label("Is Veg Only").required(),
  opening_time: Yup.string().label("Opening Time").required(),
  closing_time: Yup.string().label("Closing Time").required(),
  special_opening_time: Yup.string().label("Special Opening Time"),
  special_closing_time: Yup.string().label("Special Closing Time"),
  average_preparation_time: Yup.string()
    .label("Average Preparation Time")
    .required(),
  slug: Yup.string().label("Slug"),
  short_description: Yup.string().label("Short Description"),
  full_description: Yup.string().label("Full Description"),
  gst_number: Yup.string().label("GST Number"),
  fssai_license_number: Yup.string().label("FSSAI License Number"),
  service_radius_km: Yup.string().label("Service Radius (km)").required(),
  cancellation_policy: Yup.string().label("Cancellation Policy"),
  timezone: Yup.string().label("Timezone").default("Asia/Kolkata"),
});

 
const AddEditRBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branchDetails, setBranchDetails] = useState<IRBranch | null>(null);

  const { mutate: addMutate } = useCreateRBranchMutation({
    onSuccess: (data) => {
      navigate(AppRoutes.BRANCHES);
      setBranchDetails(data?.data as IRBranch);
    },
  });
  const { mutate: editMutate } = useUpdateRBranchMutation({
    onSuccess: (data) => {  
      navigate(AppRoutes.BRANCHES);
      setBranchDetails(data?.data as IRBranch);
    },
  });

  const { data: RestaurantList } = useGetRestaurants();
  const { data: UserList } = useGetUsers();

  const handleAddEditRBranch = (values: FormikValues) => {
    if (id) {
      editMutate(values);
    } else {
      addMutate(values);
    }
  };

  const {
    values,
    setFieldValue,
    handleSubmit,
    handleBlur,
    handleReset,
    handleChange,
    errors,
    touched,
    setFieldError,
    setFieldTouched,
  } = useFormik({
    initialValues: _.defaults(
      _.pick(branchDetails, fields),
      Object.fromEntries(fields.map((field) => [field, undefined]))
    ),
    validationSchema,
    onSubmit: handleAddEditRBranch,
  });
  console.log(errors);
  return (
    <div>
      <PageMeta
        title={id ? "Edit Branch" : "Add Branch"}
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={id ? "Edit Branch" : "Add Branch"} />
      <form onSubmit={handleSubmit} method="multipart/form-data">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <ComponentCard title="Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 ">
              <div className="col-span-2 ">
                <div>
                  <Select
                    label="Restaurant"
                    isRequired
                    setFieldTouched={setFieldTouched}
                    setFieldError={setFieldError}
                    values={values}
                    errors={errors}
                    name="restaurant_id"
                    onChange={(value: string) => {
                      setFieldValue("restaurant_id", Number(value));
                    }}
                    options={
                      (RestaurantList?.data?.map(
                        (restaurant: Partial<IRestaurant>) => ({
                          label: restaurant.name,
                          value: String(restaurant.id),
                        })
                      ) as Option[]) ?? []
                    }
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Select
                    label="Manager"
                    isRequired
                    setFieldTouched={setFieldTouched}
                    setFieldError={setFieldError}
                    values={values}
                    errors={errors}
                    name="manager_id"
                    onChange={(value: string) => {
                      setFieldValue("manager_id", Number(value));
                    }}
                    options={
                      (UserList?.data?.rows?.map((user: Partial<IUser>) => ({
                        label: `${user?.first_name ?? ""} ${
                          user?.last_name ?? ""
                        }`,
                        value: String(user.id),
                      })) as Option[]) ?? []
                    }
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="slug"
                    label="Slug"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div>
                  <TextArea
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="description"
                    label="Description"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    isRequired
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="email"
                    label="Email"
                  />
                </div>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    isRequired
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="phone_number"
                    label="Phone Number"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="alternate_phone_number"
                    label="Alternate Phone Number"
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
          <DropzoneComponent
            name="image"
            label="Upload Restaurant Image"
            setFieldTouched={setFieldTouched}
            setFieldError={setFieldError}
            isRequired
            values={values}
            touched={touched}
            errors={errors}
            onDrop={(acceptedFiles) => {
              setFieldValue("image", acceptedFiles);
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-7">
          <ComponentCard title="Delivery Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <div className="relative">
                    <Input
                      isRequired
                      label="Opening Time"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      values={values}
                      touched={touched}
                      errors={errors}
                      type="time"
                      id="tm"
                      name="opening_time"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    isRequired
                    name="gst_number"
                    label="GST Number"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="bank_name"
                    label="Bank Name"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="bank_branch"
                    label="Bank Branch"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="account_holder_name"
                    label="Account Holder Name"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="account_number"
                    label="Account Number"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="ifsc_code"
                    label="IFSC Code"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="upi_id"
                    label="UPI ID"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Other Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2">
                <div>
                  <MultiSelect
                    options={[
                      {
                        text: "Hello",
                        value: "hello",
                      },
                    ]}
                    onChange={(value) => setFieldValue("cuisine_types", value)}
                    label="Cuisine Types"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div>
                  <MultiSelect
                    options={[
                      {
                        text: "Hello",
                        value: "hello",
                      },
                    ]}
                    onChange={(value) => setFieldValue("cuisine_types", value)}
                    label="Cuisine Types"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div>
                  <TextArea
                    label="Cancellation Policy"
                    name="cancellation_policy"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Social Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="website_url"
                    label="Website URL"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="facebook_url"
                    label="Facebook URL"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>{" "}
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="instagram_url"
                    label="Instagram URL"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="  z-9999 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]  rounded-2xl py-4  border flex justify-end sticky bottom-0 mt-10">
          <div className="flex gap-5 mr-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" variant="primary">
              {id ? "Update" : "Add"} Restaurant
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditRBranch;
