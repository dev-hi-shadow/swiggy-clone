import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { FormikValues, useFormik } from "formik";
import { ICategory } from "../../types";
import _ from "lodash";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { decodeId, invalidateRoutes } from "../../utils";
import {
  useGetQuery,
  usePostMutation,
  usePutMutation,
} from "../../services/Apis";

const fields: (keyof ICategory)[] = [
  "id",
  "name",
  "slug",
  "short_description",
  "long_description",
  "image",
  "banner_image",
  "icon",
  "display_order",
  "is_featured",
  "is_active",
  "seo_title",
  "seo_description",
  "seo_keywords",
];

const validationSchema = Yup.object().shape({
  id: Yup.number().label("Id").nullable(),
  name: Yup.string().label("Name").required(),
  slug: Yup.string().label("Slug").nullable(),
  short_description: Yup.string().label("Short Description").nullable(),
  long_description: Yup.string().label("Long Description").nullable(),
  banner_image: Yup.string().label("Banner Image").nullable(),
  icon: Yup.string().label("Icon").nullable(),
  display_order: Yup.number().label("Display Order").nullable(),
  is_featured: Yup.string().label("Is Featured").nullable(),
  is_active: Yup.boolean().label("Is Active").nullable().default(true),
  seo_title: Yup.string().label("Seo Title").nullable(),
  seo_description: Yup.string().label("Seo Description").nullable(),
  seo_keywords: Yup.string().label("Seo Keywords").nullable(),
});

const AddEditRCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [CategoryDetails, setCategoryDetails] = useState<ICategory | null>(
    null
  );
  const { t } = useTranslation();

  const [addMutate] = usePostMutation();
  const [editMutate] = usePutMutation();

  const { data, isSuccess } = useGetQuery({
    endpoint: `/categories/${decodeId(String(id))}`,
  });

  const handleAddEditCategory = async (values: FormikValues) => {
    let response;
    if (id) {
      response = await editMutate({
        endpoint: `/categories/${decodeId(String(id))}`,

        body: values,
        invalidateQueries: invalidateRoutes(
          `/categories/${decodeId(String(id))}`
        ),
      }).unwrap();
    } else {
      response = await addMutate({
        endpoint: `/categories`,
        body: values,
        invalidateQueries: invalidateRoutes(
          `/categories/${decodeId(String(id))}`
        ),
      }).unwrap();
    }

    setCategoryDetails(response?.data?.data?.data as ICategory);
    navigate(`/categories`);
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
      _.pick(CategoryDetails, fields),
      Object.fromEntries(fields.map((field) => [field, undefined]))
    ),
    validationSchema,
    onSubmit: handleAddEditCategory,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setCategoryDetails(data?.data?.data as ICategory);
    }
  }, [isSuccess, data?.data]);

  return (
    <div>
      <PageMeta
        title={t(id ? "edit-category" : "add-category")}
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={t(id ? "edit-category" : "add-category")} />
      <form onSubmit={handleSubmit} method="multipart/form-data">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
          <ComponentCard title="Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 ">
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="name"
                    label="Name"
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
                    name="sort_description"
                    label="Sort Description"
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
                    name="long_description"
                    label="Long Description"
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Input
                    type="number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="display_order"
                    label="Display Order"
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
                    name="seo_title"
                    label="Seo Title"
                  />
                </div>
              </div>

              <div className="col-span-2 ">
                <div>
                  <Input
                    isRequired
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    name="seo_keywords"
                    label="Seo Keywords"
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
                    name="seo_description"
                    label="Seo Description"
                  />
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Banner Image / Image / Icon">
            <DropzoneComponent
              name="banner_image"
              setFieldTouched={setFieldTouched}
              setFieldError={setFieldError}
              isRequired
              values={values}
              touched={touched}
              key={JSON.stringify(values.banner_image)}
              errors={errors}
              label="Banner Image"
              setFieldValue={setFieldValue}
            />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 ">
              <div className="col-span-2 lg:col-span-1">
                <DropzoneComponent
                  name="image"
                  key={JSON.stringify(values.image)}
                  setFieldTouched={setFieldTouched}
                  setFieldError={setFieldError}
                  isRequired
                  values={values}
                  touched={touched}
                  errors={errors}
                  label="Image"
                  setFieldValue={setFieldValue}
                />
              </div>
              <div className="col-span-2 lg:col-span-1 ">
                <DropzoneComponent
                  name="icon"
                  key={JSON.stringify(values.icon)}
                  setFieldTouched={setFieldTouched}
                  setFieldError={setFieldError}
                  isRequired
                  values={values}
                  touched={touched}
                  errors={errors}
                  label="Icon"
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="  z-9999 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]  rounded-2xl py-4  border flex justify-end sticky bottom-0 mt-10">
          <div className="flex gap-5 mr-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              {t("button.reset")}
            </Button>
            <Button type="submit" variant="primary">
              {t(id ? "edit-category" : "add-category")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditRCategory;
