import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { FormikValues, useFormik } from "formik";
import { ICategory, ISubCategory } from "../../types";
import _ from "lodash";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { decodeId } from "../../utils";
import {
  useCreateSubCategoryMutation,
  useGetSubCategory,
  useUpdateSubCategoryMutation,
} from "../../services/api-hooks/subCategoryHooks";
import Select, { Option } from "../../components/form/Select";
import { useGetCategories } from "../../services/api-hooks/categoryHooks";

const fields: (keyof ISubCategory)[] = [
  "id",
  "category_id",
  "name",
  "slug",
  "short_description",
  "long_description",
  "image",
  "banner_image",
  "icon",
  "display_order",
  "is_active",
  "seo_title",
  "seo_description",
  "seo_keywords",
];

const validationSchema = Yup.object().shape({
  id: Yup.number().label("Id").nullable(),
  category_id: Yup.number().label("Category").required(),
  name: Yup.string().label("Name").required(),
  slug: Yup.string().label("Slug").nullable(),
  short_description: Yup.string().label("Short Description").nullable(),
  long_description: Yup.string().label("Long Description").nullable(),
  image: Yup.string().label("Image").nullable(),
  banner_image: Yup.string().label("Banner Image").nullable(),
  icon: Yup.string().label("Icon").nullable(),
  display_order: Yup.number().label("Display Order").nullable(),
  seo_title: Yup.string().label("Seo Title").nullable(),
  seo_description: Yup.string().label("Seo Description").nullable(),
  seo_keywords: Yup.string().label("Seo Keywords").nullable(),
});

const AddEditSubSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [SubCategoryDetails, setSubCategoryDetails] =
    useState<ISubCategory | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const { t } = useTranslation();

  const { mutate: addMutate } = useCreateSubCategoryMutation({
    onSuccess: (data) => {
      setSubCategoryDetails(data?.data as ISubCategory);
      navigate(`/categories`);
    },
  });
  const { mutate: editMutate } = useUpdateSubCategoryMutation({
    onSuccess: (data) => {
      setSubCategoryDetails(data?.data as ISubCategory);
      navigate(`/categories`);
    },
  });
  const { data: categoriesData } = useGetCategories();
  const { data, isSuccess } = useGetSubCategory(Number(decodeId(String(id))));

  const handleAddEditSubCategory = (values: FormikValues) => {
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
      _.pick(SubCategoryDetails, fields),
      Object.fromEntries(fields.map((field) => [field, undefined]))
    ),
    validationSchema,
    onSubmit: handleAddEditSubCategory,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setSubCategoryDetails(data?.data as ISubCategory);
    }
  }, [isSuccess, data?.data]);

  useEffect(() => {
    if (categoriesData?.data?.count) {
      const options: Option[] = categoriesData?.data?.rows.map(
        (category: Partial<ICategory>) => ({
          value: category.id?.toString() ?? "",
          label: _.startCase(category.name),
          text: _.startCase(category.name),
        })
      );
      setCategoryOptions(options);
    }
  }, [categoriesData?.data?.count, categoriesData?.data?.rows]);

  return (
    <div>
      <PageMeta
        title={t(id ? "edit-sub-category" : "add-sub-category")}
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb
        pageTitle={t(id ? "edit-sub-category" : "add-sub-category")}
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
                    label="Name"
                  />
                </div>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <div>
                  <Select
                    isRequired
                    key={JSON.stringify(categoryOptions)}
                    type="Number"
                    defaultValue={values.category_id}
                    label="Category"
                    setFieldValue={setFieldValue}
                    name="category_id"
                    setFieldError={setFieldError}
                    setFieldTouched={setFieldTouched}
                    values={values}
                    options={categoryOptions}
                  />
                </div>
              </div>
              <div className="col-span-2">
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
              errors={errors}
              label="Banner Image"
              onDrop={(acceptedFiles) => {
                setFieldValue("image", acceptedFiles);
              }}
            />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 ">
              <div className="col-span-2 lg:col-span-1">
                <DropzoneComponent
                  name="image"
                  setFieldTouched={setFieldTouched}
                  setFieldError={setFieldError}
                  isRequired
                  values={values}
                  touched={touched}
                  errors={errors}
                  label="Image"
                  onDrop={(acceptedFiles) => {
                    setFieldValue("image", acceptedFiles);
                  }}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <DropzoneComponent
                  name="icon"
                  setFieldTouched={setFieldTouched}
                  setFieldError={setFieldError}
                  isRequired
                  values={values}
                  touched={touched}
                  errors={errors}
                  label="Icon"
                  onDrop={(acceptedFiles) => {
                    setFieldValue("image", acceptedFiles);
                  }}
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
              {t(id ? "edit-sub-category" : "add-sub-category")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditSubSubCategory;
