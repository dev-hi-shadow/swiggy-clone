import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { FormikValues, useFormik } from "formik";
import { IDish } from "../../types";
import _ from "lodash";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { decodeId } from "../../utils";
import {
  useGetDish,
  useCreateDishMutation,
  useUpdateDishMutation,
} from "../../services/api-hooks/dishHooks";
import Select, { Option } from "../../components/form/Select";
import Checkbox from "../../components/form/input/Checkbox";
import MultiSelect from "../../components/form/MultiSelect";
import DatePicker from "../../components/form/date-picker";
import moment from "moment";
 
const promoTagOptions = _.map(
  [
    "limited-time",
    "chef-special",
    "seasonal-offer",
    "best-seller",
    "new-launch",
    "discounted",
    "healthy-choice",
    "customer-favorite",
    "trending-now",
    "combo-deal",
    "organic",
    "gluten-free",
    "low-calorie",
    "family-meal",
    "festive-special",
  ],
  (tag) => ({
    value: _.snakeCase(tag),
    label: _.startCase(tag),
    text: _.startCase(tag),
  })
);

const allergens = _.map(
  [
    "milk",
    "eggs",
    "fish",
    "shellfish",
    "tree nuts",
    "peanuts",
    "wheat",
    "soy",
    "sesame",
    "mustard",
    "celery",
    "lupin",
    "molluscs",
    "sulphites",
  ],
  (a) => ({
    text: _.capitalize(a),
    value: a,
  })
);

const dietaryTags = _.map(
  [
    "vegan",
    "vegetarian",
    "gluten-free",
    "dairy-free",
    "nut-free",
    "halal",
    "kosher",
    "low-carb",
    "keto",
    "paleo",
    "organic",
    "sugar-free",
    "low-fat",
    "raw",
  ],
  (dt) => ({
    text: _.capitalize(dt),
    value: dt,
  })
);
const currencyOptions: Option[] = [
  {
    label: "INR",
    value: "INR",
  },
  {
    label: "USD",
    value: "USD",
  },
  {
    label: "EUR",
    value: "EUR",
  },
];
 const priceUnitOptions: Option[] = [
  {
    label: "per Item",
    value: "per_item",
  },
  {
    label: "Per KG",
    value: "per_kg",
  },
  {
    label: "Per Litre",
    value: "per_litre",
  },
  {
    label: "Per Person",
    value: "per_person",
  },
];
const dayOptions = _.map(
  [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  (day) => ({
    label: day,
    value: _.lowerCase(day),
    text: day,
  })
);

const fields: (keyof IDish)[] = ["id", "name", "slug", "image", "banner_image"];

const validationSchema = Yup.object().shape({});

const AddEditDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [DishDetails, setDishDetails] = useState<IDish | null>(null);
  const { t } = useTranslation();

  const { mutate: addMutate } = useCreateDishMutation({
    onSuccess: (data) => {
      setDishDetails(data?.data as IDish);
      navigate(`/categories`);
    },
  });
  const { mutate: editMutate } = useUpdateDishMutation({
    onSuccess: (data) => {
      setDishDetails(data?.data as IDish);
      navigate(`/categories`);
    },
  });

  const { data, isSuccess } = useGetDish(Number(decodeId(String(id))));

  const handleAddEditDish = (values: FormikValues) => {
    if (id) {
      editMutate(values);
    } else {
      addMutate(values);
    }
  };

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    handleReset,
    handleBlur,
     handleChange,
  } = useFormik({
    initialValues: _.defaults(
      _.pick(DishDetails, fields),
      Object.fromEntries(fields.map((field) => [field, undefined]))
    ),
    validationSchema,
    onSubmit: handleAddEditDish,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setDishDetails(data?.data as IDish);
    }
  }, [isSuccess, data?.data]);

  return (
    <div>
      <PageMeta
        title={t(id ? "edit-dish" : "add-dish")}
        description="Dish management form"
      />
      <PageBreadcrumb pageTitle={t(id ? "edit-dish" : "add-dish")} />
      <form onSubmit={handleSubmit} method="multipart/form-data">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          {/* Basic Information */}
          <ComponentCard title="Basic Information">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1">
                <Input
                  values={values}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  name="name"
                  label="Dish Name"
                  isRequired
                />
              </div>
              <div className="col-span-1">
                <Input
                  values={values}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  name="slug"
                  label="Slug"
                />
              </div>
              <div className="col-span-2">
                <TextArea
                  values={values}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  name="description"
                  label="Short Description"
                />
              </div>
              <div className="col-span-2">
                <TextArea
                  values={values}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  name="long_description"
                  label="Long Description"
                />
              </div>
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="price"
                  label="Price"
                  values={values}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  isRequired
                />
              </div>

              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="original_price"
                  label="Original Price"
                  values={values}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-span-1">
                <Select
                  setFieldValue={setFieldValue}
                  values={values}
                  onChange={(value) => setFieldValue("currency", value)}
                  name="currency"
                  label="Currency"
                  options={currencyOptions}
                  isRequired
                />
              </div>
              <div className="col-span-1">
                <Select
                  setFieldValue={setFieldValue}
                  onChange={(value) => setFieldValue("price_unit", value)}
                  name="price_unit"
                  label="Price Unit"
                  options={priceUnitOptions}
                />
              </div>
            </div>
          </ComponentCard>

          {/* Images & Media */}
          <ComponentCard title="Media">
            <DropzoneComponent name="image" label="Main Image" isRequired />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1">
                <DropzoneComponent name="banner_image" label="Banner Image" />
              </div>
              <div className="col-span-1">
                <DropzoneComponent
                  name="gallery_images"
                  label="Gallery Images"
                />
              </div>
            </div>
            <Input onChange={handleChange} name="video_url" label="Video URL" />
          </ComponentCard>

          {/* Pricing & Taxes */}
          <ComponentCard title="Pricing & Taxes">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1">
                <Input
                  values={values}
                  errors={errors}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  name="tax_percentage"
                  label="Tax Percentage"
                />
              </div>
              <div className="col-span-1 my-auto">
                <Checkbox
                  values={values}
                  setFieldValue={setFieldValue}
                  name="tax_inclusive"
                  label="Tax Inclusive"
                />
              </div>
              <div className="col-span-1">
                <Input
                  values={values}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  name="service_charge_percentage"
                  label="Service Charge %"
                />
              </div>
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="packaging_charge"
                  label="Packaging Charge"
                />
              </div>
            </div>
          </ComponentCard>

          {/* Availability & Timing */}
          <ComponentCard title="Availability">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1 my-auto">
                <Checkbox
                  values={values}
                  setFieldValue={setFieldValue}
                  name="is_available"
                  label="Available Now"
                />
              </div>
              <div className="col-span-1">
                <MultiSelect
                  setFieldValue={setFieldValue}
                  defaultSelected={values.availability_days}
                  name="availability_days"
                  label="Available Days"
                  options={dayOptions}
                />
              </div>
              <div className="col-span-1">
                <DatePicker
                  defaultDate={moment().toDate()}
                  onChange={handleChange}
                  mode="time"
                  name="availability_start_time"
                  label="Start Time"
                  id="availability_start_time"
                />
              </div>
              <div className="col-span-1">
                <DatePicker
                  defaultDate={moment().toDate()}
                  onChange={handleChange}
                  mode="time"
                  name="availability_end_time"
                  label="End Time"
                  id="availability_end_time"
                />
              </div>
              <div className="col-span-1">
                <DatePicker
                  defaultDate={moment().toDate()}
                  id="availability_end_time"
                  onChange={handleChange}
                  name="blackout_dates"
                  label="Blackout Dates"
                />
              </div>
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="preparation_time_minutes"
                  label="Prep Time (mins)"
                />
              </div>
            </div>
          </ComponentCard>

          {/* Dietary & Nutrition */}
          <ComponentCard title="Dietary Info">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1">
                <Checkbox
                  onChange={handleChange}
                  name="is_veg"
                  label="Vegetarian"
                  checked={Boolean(values.is_veg)}
                  isRequired
                />
              </div>
              <div className="col-span-1">
                <Select
                  onChange={handleChange}
                  name="spicy_level"
                  label="Spicy Level"
                  options={_.map(["mild", "medium", "hot"], (spicy) => ({
                    label: _.capitalize(spicy),
                    value: spicy,
                  }))}
                />
              </div>
              <div className="col-span-1">
                <MultiSelect
                  name="dietary_tags"
                  label="Dietary Tags"
                  options={dietaryTags}
                />
              </div>
              <div className="col-span-1">
                <MultiSelect
                  name="allergens"
                  label="Allergens"
                  options={allergens}
                />
              </div>
              <TextArea name="ingredients" label="Ingredients" />
            </div>
          </ComponentCard>

          {/* Discounts & Offers */}
          <ComponentCard title="Discounts">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1">
                <Select
                  onChange={handleChange}
                  name="discount_type"
                  label="Discount Type"
                  options={_.map(["fixed", "percentage"], (dt) => ({
                    label: _.capitalize(dt),
                    value: dt,
                  }))}
                />
              </div>
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="discount_amount"
                  label="Discount Amount"
                />
              </div>
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="discount_percentage"
                  label="Discount Percentage"
                />
              </div>
              <div className="col-span-1">
                <DatePicker
                  defaultDate={moment().toDate()}
                  mode="time"
                  name="discount_start_time"
                  label="Discount Start"
                  id="discount_start_time"
                />
              </div>
              <div className="col-span-1">
                <DatePicker
                  mode="time"
                  id="discount_end_time"
                  defaultDate={moment().toDate()}
                  name="discount_end_time"
                  label="Discount End"
                />
              </div>
            </div>
          </ComponentCard>

          {/* Inventory & Ordering */}
          <ComponentCard title="Inventory">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="stock_quantity"
                  label="Stock Qty"
                />
              </div>
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="min_order_qty"
                  label="Min Order"
                />
              </div>
              <div className="col-span-1">
                <Input
                  onChange={handleChange}
                  type="number"
                  name="max_order_qty"
                  label="Max Order"
                />
              </div>
              <div className="col-span-1 my-auto">
                <Checkbox
                  onChange={handleChange}
                  checked={Boolean(values.preorder_available)}
                  name="preorder_available"
                  label="Preorder Available"
                />
              </div>
            </div>
          </ComponentCard>

          {/* SEO & Marketing */}
          <ComponentCard title="SEO">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5">
              <Input
                onChange={handleChange}
                name="seo_title"
                label="SEO Title"
              />
              <TextArea name="seo_description" label="SEO Description" />
              <MultiSelect
                name="promo_tags"
                label="Promo Tags"
                options={promoTagOptions}
              />
              <Input
                onChange={handleChange}
                name="share_url"
                label="Share URL"
              />
            </div>
          </ComponentCard>
        </div>

        {/* Form Actions */}
        <div className="z-999 sticky bottom-0 mt-10 py-4 border-t bg-white dark:bg-gray-800 flex justify-end">
          <div className="flex gap-5 mr-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              {t("button.reset")}
            </Button>
            <Button type="submit" variant="primary">
              {t(id ? "edit-dish" : "add-dish")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditDish;
