import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { FormikValues, useFormik } from "formik";
import { IRestaurant } from "../../types";
import _ from "lodash";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import * as Yup from "yup";
import MultiSelect from "../../components/form/MultiSelect";
import {
  useCreateRestaurantMutation,
  useGetRestaurant,
  useUpdateRestaurantMutation,
} from "../../services/api-hooks/restaurantsHook";
import { AppRoutes } from "../../constants";
import { decodeId } from "../../utils";
import { useTranslation } from "react-i18next";

const fields: (keyof IRestaurant)[] = [
  "name",
  "slug",
  "description",
  "image",
  "email",
  "phone_number",
  "alternate_phone_number",
  "website_url",
  "facebook_url",
  "instagram_url",
  "gst_number",
  "fssai_license_number",
  "is_chain",
  "founded_year",
  "cuisine_types",
  "tags",
  "cancellation_policy",
  "account_number",
  "upi_id",
  "swift_code",
  "bank_name",
  "bank_branch",
  "ifsc_code",
  "account_holder_name",
  "owner_id",
  "id",
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().label("Slug").nullable(),
  description: Yup.string().label("Description").nullable(),
  image: Yup.array().of(Yup.mixed().required("Image is required")).nullable(),
  email: Yup.string().email().label("Email").required(),
  phone_number: Yup.string().required().label("Phone Number"),
  alternate_phone_number: Yup.string()
    .label("Alternate Phone Number")
    .nullable(),
  website_url: Yup.string().label("Website URL").nullable(),
  facebook_url: Yup.string().label("Facebook URL").nullable(),
  instagram_url: Yup.string().label("Instagram URL").nullable(),
  gst_number: Yup.string().required().label("GST Number"),
  fssai_license_number: Yup.string().required().label("FSSAI License Number"),
  is_chain: Yup.boolean().label("Is Chain").default(false).nullable(),
  founded_year: Yup.string().required().label("Founded Year"),
  cuisine_types: Yup.string().label("Cuisine Types").nullable(),
  tags: Yup.string().label("Tags").nullable(),
  cancellation_policy: Yup.string().label("Cancellation Policy").nullable(),
  account_number: Yup.string().label("Account Number").nullable(),
  upi_id: Yup.string().label("UPI ID").nullable(),
  swift_code: Yup.string().label("Swift Code").nullable(),
  bank_name: Yup.string().label("Bank Name").nullable(),
  bank_branch: Yup.string().label("Bank Branch").nullable(),
  ifsc_code: Yup.string().label("IFSC Code").nullable(),
  account_holder_name: Yup.string().label("Account Holder Name").nullable(),
});


const AddEditRestaurant = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [restaurantDetails, setRestaurantDetails] =
    useState<IRestaurant | null>(null);

  const { mutate: addMutate } = useCreateRestaurantMutation({
    onSuccess: (data) => {
      navigate(AppRoutes.ADD_BRANCH);
      setRestaurantDetails(data?.data as IRestaurant);
    },
  });
  const { mutate: editMutate } = useUpdateRestaurantMutation({
    onSuccess: (data) => {
      navigate(AppRoutes.RESTAURANTS);
      setRestaurantDetails(data?.data as IRestaurant);
    },
  });

  const { data, isSuccess } = useGetRestaurant(Number(decodeId(String(id))));

  useEffect(() => {
    if (isSuccess) {
      setRestaurantDetails(data?.data as IRestaurant);
    }
  }, [data?.data, isSuccess]);

  const handleAddEditRestaurant = (values: FormikValues) => {
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
      _.pick(restaurantDetails, fields),
      Object.fromEntries(fields.map((field) => [field, undefined]))
    ),
    validationSchema,
    onSubmit: handleAddEditRestaurant,
    enableReinitialize: true,
  });
   return (
     <div>
       <PageMeta
         title={t(id ? "edit-restaurant" : "add-restaurant")}
         description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
       />
       <PageBreadcrumb
         pageTitle={t(id ? "edit-restaurant" : "add-restaurant")}
       />
       <form onSubmit={handleSubmit} method="multipart/form-data">
         <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
           <ComponentCard title="Information">
             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 ">
               <div className="col-span-2 lg:col-span-1">
                 <div>
                   <Input
                     isRequired
                     onChange={handleChange}
                     onBlur={handleBlur}
                     values={values}
                     touched={touched}
                     errors={errors}
                     name="name"
                     label="Restaurant Name"
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
                     label="Restaurant Slug"
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
                     label="Restaurant Description"
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
                     name="founded_year"
                     label="Founded Year"
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
           <ComponentCard title="Legal & Bank Information">
             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
                     isRequired
                   />
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
                         label: "Hello",
                         text: "Hello",
                         value: "hello",
                       },
                     ]}
                     name="cuisine_types"
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
                         label: "Hello",
                         text: "Hello",
                         value: "hello",
                       },
                     ]}
                     name="cuisine_types"
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

         {/* <div className="  z-9999 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]  rounded-2xl py-4  border flex  ps-5  mt-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Branch Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <ComponentCard className="mt-7" title="Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    type="text"
                    name="branch_name"
                    label="Branch Name"
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
                    type="text"
                    name="sort_description"
                    label="Branch Short Description"
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div className="col-span-2 ">
                <div>
                  <TextArea
                    label="Branch Description"
                    name="description"
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
                    type="text"
                    name="email"
                    label="Email"
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
                    type="text"
                    name="phone_number"
                    label="Phone Number"
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
                    type="text"
                    name="branch.alternate_phone_number"
                    label="Alternate Phone Number"
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
        </div> */}

         <div className="  z-9999 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900  rounded-2xl py-4  border flex justify-end sticky bottom-0 mt-10">
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

export default AddEditRestaurant;
