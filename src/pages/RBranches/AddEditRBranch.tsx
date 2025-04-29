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
import { AppRoutes } from "../../constants";
import {
  useCreateRBranchMutation,
  useUpdateRBranchMutation,
} from "../../services/api-hooks/branchHooks";
import Select, { Option } from "../../components/form/Select";
import { useGetRestaurants } from "../../services/api-hooks/restaurantsHook";
import { useGetUsers } from "../../services/api-hooks/usersHook";
import Switch from "../../components/form/switch/Switch";
import { LeafIcon } from "../../components/svgs";

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
  id: Yup.number().label("ID"),
  restaurant_id: Yup.number()
    .required("Restaurant is required")
    .label("Restaurant"),
  manager_id: Yup.number().required().label("Manager"),
  owner_id: Yup.number().label("Owner"),
  location: Yup.string().required().label("Location"),
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
  min_order_value: Yup.number().label("Min Order Value"),
  max_order_value: Yup.number().label("Max Order Value"),
  is_open: Yup.boolean().label("Is Open").required().default(true),
  is_available_for_delivery: Yup.boolean()
    .label("Is Available For Delivery")
    .required()
    .default(true),
  is_available_for_pickup: Yup.boolean()
    .label("Is Available For Pickup")
    .required()
    .default(true),
  is_veg_only: Yup.boolean().label("Pure Veg").required().default(true),
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
  gst_number: Yup.string().label("GST Number").required(),
  fssai_license_number: Yup.string().label("FSSAI License Number"),
  service_radius_km: Yup.number()
    .label("Service Radius (km)")
    .required()
    .default(7),
  cancellation_policy: Yup.string().label("Cancellation Policy"),
  timezone: Yup.string().label("Timezone").default("Asia/Kolkata"),
  country: Yup.string().required().label("Country"),
  state: Yup.string().required().label("State"),
  city: Yup.string().required().label("City"),
  zip_code: Yup.string().required().label("Zip Code/Pin Code"),
  landmark: Yup.string().label("Landmark"),
  block_floor_number: Yup.string().required().label("Block/Floor Number"),
  nearby_landmark: Yup.string().label("Nearby Landmark"),
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
                    touched={touched}
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
                    label="Owner"
                    isRequired
                    setFieldTouched={setFieldTouched}
                    setFieldError={setFieldError}
                    values={values}
                    errors={errors}
                    touched={touched}
                    name="owner_id"
                    onChange={(value: string) => {
                      setFieldValue("owner_id", Number(value));
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
                  <Select
                    label="Manager"
                    isRequired
                    setFieldTouched={setFieldTouched}
                    setFieldError={setFieldError}
                    values={values}
                    errors={errors}
                    name="manager_id"
                    touched={touched}
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
          <ComponentCard title="Image & Location Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                  type="number"
                    isRequired
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="block_floor_number"
                    label="Block/Floor No."
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
                    name="landmark"
                    label="Landmark"
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
                    name="nearby_landmark"
                    label="Nearby/Beside/Under/Above"
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
                    name="location"
                    label="Street/Area/Locality"
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
                    name="city"
                    label="City"
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
                    name="state"
                    label="State"
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
                    name="zip_code"
                    label="Zip Code/Pin Code"
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
                    name="country"
                    label="Country"
                  />
                </div>
              </div>
            </div>
            <DropzoneComponent
              name="image"
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
          </ComponentCard>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-7">
          <ComponentCard title="Delivery & Timing Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    isRequired
                    hint="00:00 for 24/7"
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
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    isRequired
                    hint="00:00 for 24/7"
                    label="Closing Time"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    type="time"
                    id="tm"
                    name="closing_time"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    isRequired
                    autoComplete={true}
                    label="Average Preparation Time"
                    hint="in (hh:mm)"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    type="time"
                    id="tm"
                    name="average_preparation_time"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    isRequired
                    hint="in (hh:mm)"
                    autoComplete={true}
                    label="Expected Delivery Time"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    type="time"
                    id="tm"
                    name="expected_delivery_time"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="packaging_charge"
                    label="Packaging Charge"
                    type="number"
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
                    name="delivery_charge"
                    label="Delivery Charge"
                    type="number"
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
                    isRequired
                    name="service_radius_km"
                    label="Service Radius"
                    hint="in KM"
                    values={values}
                    errors={errors}
                    type="number"
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="cancellation_policy"
                    label="Cancellation Policy"
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
                  <Switch
                    errors={errors}
                    labelEndIcon={<LeafIcon />}
                    name="is_veg_only"
                    values={values}
                    touched={touched}
                    defaultChecked={true}
                    label="Pure Veg"
                    onChange={(value) => setFieldValue(`is_veg_only`, value)}
                    className="justify-between"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Switch
                    errors={errors}
                    name="is_open"
                    values={values}
                    touched={touched}
                    defaultChecked={true}
                    label="Is Open"
                    onChange={(value) => setFieldValue(`is_open`, value)}
                    className="justify-between"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Switch
                    errors={errors}
                    name="is_available_for_delivery"
                    values={values}
                    touched={touched}
                    defaultChecked={true}
                    label="Is Available For Delivery"
                    className="justify-between"
                    onChange={(value) =>
                      setFieldValue(`is_available_for_delivery`, value)
                    }
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Switch
                    errors={errors}
                    name="is_available_for_pickup"
                    values={values}
                    className="justify-between"
                    touched={touched}
                    defaultChecked={true}
                    label="Is Available For Pickup"
                    onChange={(value) =>
                      setFieldValue(`is_available_for_pickup`, value)
                    }
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Expense & Other Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                  type="number"
                    name="min_order_value"
                    label="Minimum Order Value"
                    hint="For free delivery"
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
                  type="number"
                    name="max_order_value"
                    label="Maximum Order Value"
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
                    type="number"
                    name="average_price_for_one"
                    label="Average Expense (for one person)"
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
                    type="number"
                    name="average_price_for_two"
                    label="Average Expense (for two person)"
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
                    name="special_opening_time"
                    label="Special Opening Time"
                    values={values}
                    hint="For special occasion/festival"
                    errors={errors}
                    type="time"
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    name="special_opening_time"
                    label="Special Closing Time"
                    hint="For special occasion/festival"
                    values={values}
                    errors={errors}
                    type="time"
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Legal Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
                    name="fssai_license_number"
                    label="FSSAI License Number"
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
