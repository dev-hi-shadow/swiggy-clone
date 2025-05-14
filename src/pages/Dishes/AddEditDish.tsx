import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { FormikValues, useFormik } from "formik";
import { ICategory, IDish, IRBranch, IRestaurant, ISubCategory } from "../../types";
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
 import { useGetCategories } from "../../services/api-hooks/categoryHooks";
import { useGetSubCategories } from "../../services/api-hooks/subCategoryHooks";
import { useGetRestaurants } from "../../services/api-hooks/restaurantsHook";
import { useGetRBranches } from "../../services/api-hooks/branchHooks";
import { AppRoutes } from "../../constants";

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
    label: _.capitalize(a),
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
    label: _.capitalize(dt),
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
    label: "Item",
    value: "per_item",
  },
  {
    label: "KG",
    value: "per_kg",
  },
  {
    label: "Litre",
    value: "per_litre",
  },
  {
    label: "Person",
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

const fields: (keyof IDish)[] = [
  "id",
  "restaurant_id",
  "branch_id",
  "category_id",
  "subcategory_id",
  "parent_dish_id",
  "name",
  "slug",
  "description",
  "long_description",
  "image",
  "banner_image",
  "gallery_images",
  "video_url",
  "tags",
  "price",
  "original_price",
  "currency",
  "price_unit",
  "tax_percentage",
  "tax_inclusive",
  "service_charge_percentage",
  "packaging_charge",
  "discount_type",
  "discount_amount",
  "discount_percentage",
  "discount_start_time",
  "discount_end_time",
  "discount_max_quantity",
  "discount_min_quantity",
  "discount_max_quantity_per_user",
  "discount_min_quantity_per_user",
  "discount_max_quantity_per_order",
  "discount_min_quantity_per_order",
  "discount_max_quantity_per_user_per_order",
  "discount_min_quantity_per_user_per_order",
  "discount_applies_with_coupon",
  "promo_code_applicable",
  "is_available",
  "availability_days",
  "availability_start_time",
  "availability_end_time",
  "blackout_dates",
  "preorder_available",
  "preorder_hours",
  "delivery_eta_minutes",
  "delivery_buffer_minutes",
  "preparation_time_minutes",
  "stock_quantity",
  "min_order_qty",
  "max_order_qty",
  "available_portions",
  "is_veg",
  "is_customizable",
  "spicy_level",
  "dietary_tags",
  "allergen_info",
  "allergens",
  "ingredients",
  "ingredients_options",
  "customization_groups",
  "meal_time_tags",
  "featured",
  "is_featured",
  "is_new",
  "is_popular",
  "is_recommended",
  "is_best_seller",
  "is_chef_special",
  "is_available_for_delivery",
  "is_available_for_pickup",
  "is_available_for_dine_in",
  "is_available_for_takeaway",
  "language_tags",
  "regional_exclusivity",
  "cuisine_type",
  "name_translations",
  "description_translations",
  "seo_title",
  "seo_description",
  "promo_tags",
  "share_url",
  "rating",
  "total_reviews",
  "average_rating",
  "total_orders",
  "reorder_rate",
  "cart_additions",
  "view_count",
  "conversion_rate",
  "user_likes_count",
  "order_count",
  "reorder_probability",
  "smart_tags",
  "kitchen_station",
  "priority_order",
  "shelf_life_hours",
  "is_ready_to_eat",
  "approval_status",
  "rejection_reason",
  "fssai_info",
  "auto_tags",
  "paired_dish_ids",
  "created_at",
  "updated_at",
  "deleted_at",
  "created_by",
  "updated_by",
  "deleted_by",
];


const validationSchema = Yup.object().shape({
  id: Yup.string().label("id").nullable(),
  restaurant_id: Yup.string().label("restaurant_id").nullable(),
  branch_id: Yup.string().label("branch_id").nullable(),
  category_id: Yup.string().label("category_id").nullable(),
  subcategory_id: Yup.string().label("subcategory_id").nullable(),
  parent_dish_id: Yup.string().label("parent_dish_id").nullable(),
  name: Yup.string().label("name").nullable(),
  slug: Yup.string().label("slug").nullable(),
  description: Yup.string().label("description").nullable(),
  long_description: Yup.string().label("long_description").nullable(),
  image: Yup.string().label("image").nullable(),
  banner_image: Yup.string().label("banner_image").nullable(),
  gallery_images: Yup.string().label("gallery_images").nullable(),
  video_url: Yup.string().label("video_url").nullable(),
  tags: Yup.string().label("tags").nullable(),
  price: Yup.string().label("price").nullable(),
  original_price: Yup.string().label("original_price").nullable(),
  currency: Yup.string().label("currency").nullable(),
  price_unit: Yup.string().label("price_unit").nullable(),
  tax_percentage: Yup.string().label("tax_percentage").nullable(),
  tax_inclusive: Yup.string().label("tax_inclusive").nullable(),
  service_charge_percentage: Yup.string()
    .label("service_charge_percentage")
    .nullable(),
  packaging_charge: Yup.string().label("packaging_charge").nullable(),
  discount_type: Yup.string().label("discount_type").nullable(),
  discount_amount: Yup.string().label("discount_amount").nullable(),
  discount_percentage: Yup.string().label("discount_percentage").nullable(),
  discount_start_time: Yup.string().label("discount_start_time").nullable(),
  discount_end_time: Yup.string().label("discount_end_time").nullable(),
  discount_max_quantity: Yup.string().label("discount_max_quantity").nullable(),
  discount_min_quantity: Yup.string().label("discount_min_quantity").nullable(),
  discount_max_quantity_per_user: Yup.string()
    .label("discount_max_quantity_per_user")
    .nullable(),
  discount_min_quantity_per_user: Yup.string()
    .label("discount_min_quantity_per_user")
    .nullable(),
  discount_max_quantity_per_order: Yup.string()
    .label("discount_max_quantity_per_order")
    .nullable(),
  discount_min_quantity_per_order: Yup.string()
    .label("discount_min_quantity_per_order")
    .nullable(),
  discount_max_quantity_per_user_per_order: Yup.string()
    .label("discount_max_quantity_per_user_per_order")
    .nullable(),
  discount_min_quantity_per_user_per_order: Yup.string()
    .label("discount_min_quantity_per_user_per_order")
    .nullable(),
  discount_applies_with_coupon: Yup.string()
    .label("discount_applies_with_coupon")
    .nullable(),
  promo_code_applicable: Yup.string().label("promo_code_applicable").nullable(),
  is_available: Yup.string().label("is_available").nullable(),
  availability_days: Yup.array()
    .of(Yup.string())
    .label("availability_days")
    .nullable(),
  availability_start_time: Yup.string()
    .label("availability_start_time")
    .nullable(),
  availability_end_time: Yup.string().label("availability_end_time").nullable(),
  blackout_dates: Yup.array().of(Yup.string()).label("blackout_dates"),
  preorder_available: Yup.string().label("preorder_available").nullable(),
  preorder_hours: Yup.string().label("preorder_hours").nullable(),
  delivery_eta_minutes: Yup.string().label("delivery_eta_minutes").nullable(),
  delivery_buffer_minutes: Yup.string()
    .label("delivery_buffer_minutes")
    .nullable(),
  preparation_time_minutes: Yup.string()
    .label("preparation_time_minutes")
    .nullable(),
  stock_quantity: Yup.string().label("stock_quantity").nullable(),
  min_order_qty: Yup.string().label("min_order_qty").nullable(),
  max_order_qty: Yup.string().label("max_order_qty").nullable(),
  available_portions: Yup.string().label("available_portions").nullable(),
  is_veg: Yup.string().label("is_veg").nullable(),
  is_customizable: Yup.string().label("is_customizable").nullable(),
  spicy_level: Yup.string().label("spicy_level").nullable(),
  dietary_tags: Yup.string().label("dietary_tags").nullable(),
  allergen_info: Yup.string().label("allergen_info").nullable(),
  allergens: Yup.string().label("allergens").nullable(),
  ingredients: Yup.string().label("ingredients").nullable(),
  ingredients_options: Yup.string().label("ingredients_options").nullable(),
  customization_groups: Yup.string().label("customization_groups").nullable(),
  addons_group_ids: Yup.string().label("addons_group_ids").nullable(),
  variant_group_ids: Yup.string().label("variant_group_ids").nullable(),
  combo_group_id: Yup.string().label("combo_group_id").nullable(),
  meal_time_tags: Yup.string().label("meal_time_tags").nullable(),
  featured: Yup.string().label("featured").nullable(),
  is_featured: Yup.string().label("is_featured").nullable(),
  is_new: Yup.string().label("is_new").nullable(),
  is_popular: Yup.string().label("is_popular").nullable(),
  is_recommended: Yup.string().label("is_recommended").nullable(),
  is_best_seller: Yup.string().label("is_best_seller").nullable(),
  is_chef_special: Yup.string().label("is_chef_special").nullable(),
  is_available_for_delivery: Yup.string()
    .label("is_available_for_delivery")
    .nullable(),
  is_available_for_pickup: Yup.string()
    .label("is_available_for_pickup")
    .nullable(),
  is_available_for_dine_in: Yup.string()
    .label("is_available_for_dine_in")
    .nullable(),
  is_available_for_takeaway: Yup.string()
    .label("is_available_for_takeaway")
    .nullable(),
  language_tags: Yup.string().label("language_tags").nullable(),
  regional_exclusivity: Yup.string().label("regional_exclusivity").nullable(),
  cuisine_type: Yup.string().label("cuisine_type").nullable(),
  name_translations: Yup.string().label("name_translations").nullable(),
  description_translations: Yup.string()
    .label("description_translations")
    .nullable(),
  seo_title: Yup.string().label("seo_title").nullable(),
  seo_description: Yup.string().label("seo_description").nullable(),
  promo_tags: Yup.string().label("promo_tags").nullable(),
  share_url: Yup.string().label("share_url").nullable(),
  rating: Yup.string().label("rating").nullable(),
  total_reviews: Yup.string().label("total_reviews").nullable(),
  average_rating: Yup.string().label("average_rating").nullable(),
  total_orders: Yup.string().label("total_orders").nullable(),
  reorder_rate: Yup.string().label("reorder_rate").nullable(),
  cart_additions: Yup.string().label("cart_additions").nullable(),
  view_count: Yup.string().label("view_count").nullable(),
  conversion_rate: Yup.string().label("conversion_rate").nullable(),
  user_likes_count: Yup.string().label("user_likes_count").nullable(),
  order_count: Yup.string().label("order_count").nullable(),
  reorder_probability: Yup.string().label("reorder_probability").nullable(),
  smart_tags: Yup.string().label("smart_tags").nullable(),
  kitchen_station: Yup.string().label("kitchen_station").nullable(),
  priority_order: Yup.string().label("priority_order").nullable(),
  shelf_life_hours: Yup.string().label("shelf_life_hours").nullable(),
  is_ready_to_eat: Yup.string().label("is_ready_to_eat").nullable(),
  approval_status: Yup.string().label("approval_status").nullable(),
  rejection_reason: Yup.string().label("rejection_reason").nullable(),
  fssai_info: Yup.string().label("fssai_info").nullable(),
  auto_tags: Yup.string().label("auto_tags").nullable(),
  paired_dish_ids: Yup.string().label("paired_dish_ids").nullable(),
  created_at: Yup.string().label("created_at").nullable(),
  updated_at: Yup.string().label("updated_at").nullable(),
  deleted_at: Yup.string().label("deleted_at").nullable(),
  created_by: Yup.string().label("created_by").nullable(),
  updated_by: Yup.string().label("updated_by").nullable(),
  deleted_by: Yup.string().label("deleted_by").nullable(),
});

const AddEditDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [DishDetails, setDishDetails] = useState<IDish | null>(null);
  const { t } = useTranslation();
  const [Categories, setCategories] = useState<Option[]>([]);
  const [SubCategories, setSubCategories] = useState<Option[]>([]);
  const [RestaurantOptions, setRestaurantOptions] = useState<Option[]>([]);
  const [BranchOptions, setBranchOptions] = useState<Option[]>([]);
 
  const { mutate: addMutate } = useCreateDishMutation({
    onSuccess: (data) => {
      setDishDetails(data?.data as IDish);
      navigate(AppRoutes.DISHES);
    },
  });
  const { mutate: editMutate } = useUpdateDishMutation({
    onSuccess: (data) => {
      setDishDetails(data?.data as IDish);
      navigate(AppRoutes.DISHES);
    },
  });

  const { data, isSuccess } = useGetDish(Number(decodeId(String(id))));
 
  const handleAddEditDish = (values: FormikValues) => {
    if (id) {
      console.log("HANDLE SUBMIT " , values)
      editMutate(values);
    } else {
      console.log("HANDLE SUBMIT " , values)
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
    setFieldError,
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

  console.log(errors , values , )

  useEffect(() => {
    if (isSuccess) {
      setDishDetails(data?.data as IDish);
    }
  }, [isSuccess, data?.data]);




  const { data: CategoryData } = useGetCategories();
  useEffect(() => {
    if (CategoryData?.data) {
      setCategories(() => {
        return _.isArray(CategoryData?.data?.rows)
          ? CategoryData?.data?.rows?.map((item: Partial<ICategory>) => {
              return {
                label: item?.name ?? "",
                value: item?.id ?? "",
                text: item?.name ?? "",
              };
            })
          : [];
      });
    }
  }, [CategoryData?.data]);

  const { data: SubCategoryData } = useGetSubCategories(
    Number(values?.category_id)
  );
  useEffect(() => {
    if (SubCategoryData?.data) {
      setSubCategories(() => {
        return _.isArray(SubCategoryData?.data?.rows)
          ? SubCategoryData?.data?.rows?.map((item: Partial<ISubCategory>) => {
              return {
                label: item?.name ?? "",
                value: item?.id ?? "",
                text: item?.name ?? "",
              };
            })
          : [];
      });
    }
  }, [SubCategoryData?.data]);


  const {data : RestaurantData} = useGetRestaurants()
  const { data: RBranchData } = useGetRBranches(Number(values?.restaurant_id));

  useEffect(() => {
    if (RestaurantData?.data) {
      setRestaurantOptions(() => {
        return _.isArray(RestaurantData?.data)
          ? RestaurantData?.data?.map((item: Partial<IRestaurant>) => {
            return {
              label: item?.name ?? "",
                value: item?.id ?? "",
                text: item?.name ?? "",
              };
            })
          : [];
        });
      }
    }, [RestaurantData?.data]);
     
  useEffect(() => {
    if (RBranchData?.data) {
      setBranchOptions(() => {
        return _.isArray(RBranchData?.data)
          ? RBranchData?.data?.map((item: Partial<IRBranch>) => {
              return {
                label: item?.location ?? "",
                value: item?.id ?? "",
                text: item?.location ?? "",
              };
            })
          : [];
      });
    }
  }, [RBranchData?.data]);

 
  return (
    <div>
      <PageMeta
        title={t(id ? "edit-dish" : "add-dish")}
        description="Dish management form"
      />
      <PageBreadcrumb pageTitle={t(id ? "edit-dish" : "add-dish")} />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5  xl:grid-cols-2">
          {/* Basic Information */}

          <div className="col-span-2 xl:col-span-1">
            <ComponentCard title="Basic Information">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
                <div className="col-span-1 ">
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
                <div className="col-span-1 ">
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
                    onChange={handleChange}
                    touched={touched}
                    name="long_description"
                    label="Long Description"
                  />
                </div>
                <div className="col-span-1 ">
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

                <div className="col-span-1 ">
                  <Select
                    setFieldValue={setFieldValue}
                    values={values}
                    defaultValue={values.price_unit ?? "INR"}
                    name="currency"
                    label="Currency"
                    options={currencyOptions}
                    isRequired
                  />
                </div>
                <div className="col-span-1 ">
                  <Select
                    setFieldValue={setFieldValue}
                    defaultValue={values.price_unit ?? "per_item"}
                    name="price_unit"
                    label="Price Unit"
                    options={priceUnitOptions}
                  />
                </div>
              </div>
            </ComponentCard>
          </div>
          <div className="col-span-2 xl:col-span-1">
            <ComponentCard title="Associations" className="h-full">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
                <div className="col-span-1 ">
                  <Select
                    type="Number"
                    name="restaurant_id"
                    defaultValue={values.restaurant_id}
                    options={RestaurantOptions}
                    label="Restaurant"
                    setFieldValue={setFieldValue}
                    setFieldError={setFieldError}
                  />
                </div>
                <div className="col-span-1 ">
                  <Select
                    type="Number"
                    name="branch_id"
                    options={BranchOptions}
                    label="Branch"
                    setFieldValue={setFieldValue}
                    setFieldError={setFieldError}
                  />
                </div>
                <div className="col-span-1 ">
                  <Select
                    type="Number"
                    name="category_id"
                    defaultValue={values.category_id}
                    options={Categories}
                    label="Category"
                    setFieldValue={setFieldValue}
                    setFieldError={setFieldError}
                  />
                </div>
                <div className="col-span-1 ">
                  <Select
                    type="Number"
                    name="subcategory_id"
                    options={SubCategories}
                    label="Sub Category"
                    setFieldValue={setFieldValue}
                    setFieldError={setFieldError}
                  />
                </div>
              </div>
            </ComponentCard>
          </div>
          <div className="col-span-2">
            {/* Images & Media */}
            <ComponentCard title="Media">
              <div className=" grid grid-cols-1 lg:grid-cols-3  gap-x-6 gap-y-5  xl:grid-cols-4">
                <div className="xl:col-span-2  ">
                  <DropzoneComponent
                    name="image"
                    className="h-full"
                    label="Main Image"
                    onDrop={(file) => setFieldValue("Images", file)}
                    isRequired
                  />
                </div>
                <div className="col-span-1  ">
                  <DropzoneComponent
                    name="banner_image"
                    label="Banner Image"
                    onDrop={(file) => setFieldValue("banner_Images", file)}
                  />
                </div>
                <div className="col-span-1 ">
                  <DropzoneComponent
                    name="gallery_images"
                    label="Gallery Images"
                    onDrop={(file) => setFieldValue("gallery_images", file)}
                  />
                </div>
              </div>
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                values={values}
                errors={errors}
                touched={touched}
                name="video_url"
                label="Video URL"
              />
            </ComponentCard>
          </div>

          {/* Pricing & Taxes */}
          <ComponentCard title="Pricing & Taxes">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
              <div className="col-span-1 ">
                <Input
                  values={values}
                  errors={errors}
                  touched={touched}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  name="tax_percentage"
                  label="Tax Percentage"
                />
              </div>
              <div className="col-span-1  my-auto">
                <Checkbox
                  values={values}
                  setFieldValue={setFieldValue}
                  name="tax_inclusive"
                  label="Tax Inclusive"
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  values={values}
                  touched={touched}
                  errors={errors}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="number"
                  name="service_charge_percentage"
                  label="Service Charge %"
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  type="number"
                  values={values}
                  touched={touched}
                  errors={errors}
                  onBlur={handleBlur}
                  name="packaging_charge"
                  label="Packaging Charge"
                />
              </div>
            </div>
          </ComponentCard>

          {/* Availability & Timing */}
          <ComponentCard title="Availability">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
              <div className="col-span-1  my-auto">
                <Checkbox
                  values={values}
                  setFieldValue={setFieldValue}
                  name="is_available"
                  label="Available Now"
                />
              </div>
              <div className="col-span-1 ">
                <MultiSelect
                  isRequired
                  setFieldValue={setFieldValue}
                  values={values.availability_days}
                  name="availability_days"
                  label="Available Days"
                  options={dayOptions}
                />
              </div>
              <div className="col-span-1 ">
                <DatePicker
                  name="blackout_dates"
                  label="Blackout Dates"
                  required
                  use12Hour
                  setFieldValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                  mode="multiple"
                  wrapperClass="w-full"
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  name="availability_start_time"
                  label="Availability Start Time"
                  isRequired
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="time"
                />
              </div>

              <div className="col-span-1 ">
                <Input
                  name="availability_end_time"
                  label="Availability End Time"
                  isRequired
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="time"
                />
              </div>
            </div>
          </ComponentCard>

          {/* Dietary & Nutrition */}
          <ComponentCard title="Dietary Info">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
              <div className="col-span-1  my-auto">
                <Checkbox
                  onChange={handleChange}
                  name="is_veg"
                  values={values}
                  setFieldValue={setFieldValue}
                  label="Vegetarian"
                  isRequired
                />
              </div>
              <div className="col-span-1 ">
                <Select
                  onChange={handleChange}
                  defaultValue={values.spicy_level ?? "medium"}
                  name="spicy_level"
                  label="Spicy Level"
                  options={_.map(["mild", "medium", "hot"], (spicy) => ({
                    label: _.capitalize(spicy),
                    value: spicy,
                  }))}
                />
              </div>
              <div className="col-span-1 ">
                <MultiSelect
                  name="dietary_tags"
                  label="Dietary Tags"
                  options={dietaryTags}
                />
              </div>

              <div className="col-span-1 ">
                <MultiSelect
                  name="allergens"
                  label="Allergens"
                  options={allergens}
                  setFieldValue={setFieldValue}
                />
              </div>
              <div className="col-span-2">
                <TextArea name="ingredients" label="Ingredients" />
              </div>
            </div>
          </ComponentCard>

          {/* Discounts & Offers */}
          <ComponentCard title="Discounts">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
              <div className="col-span-1 ">
                <Select
                  setFieldValue={setFieldValue}
                  name="discount_type"
                  label="Discount Type"
                  options={_.map(["fixed", "percentage"], (dt) => ({
                    label: _.capitalize(dt),
                    value: dt,
                  }))}
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="number"
                  name="discount_amount"
                  label="Discount Amount"
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="number"
                  name="discount_percentage"
                  label="Discount Percentage"
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="number"
                  name="discount_amount_upto"
                  label="Discount Amount (Upto)"
                />
              </div>
              <div className="col-span-1 ">
                <DatePicker
                  value={values.discount_start_time}
                  name="discount_start_time"
                  label="Start Time"
                  required
                  use12Hour
                  setFieldValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-span-1 ">
                <DatePicker
                  name="discount_end_time"
                  label="End Time"
                  required
                  use12Hour
                  setFieldValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </ComponentCard>

          {/* Inventory & Ordering */}
          <ComponentCard title="Inventory">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="number"
                  name="stock_quantity"
                  label="Stock Qty"
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="number"
                  name="min_order_qty"
                  label="Min Order"
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  type="number"
                  name="max_order_qty"
                  label="Max Order"
                />
              </div>
              <div className="col-span-1  my-auto">
                <Checkbox
                  setFieldValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
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
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  name="seo_title"
                  label="SEO Title"
                />
              </div>
              <div className="col-span-1 ">
                <TextArea name="seo_description" label="SEO Description" />
              </div>
              <div className="col-span-1 ">
                <MultiSelect
                  name="promo_tags"
                  label="Promo Tags"
                  options={promoTagOptions}
                  setFieldValue={setFieldValue}
                />
              </div>
              <div className="col-span-1 ">
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                  name="share_url"
                  label="Share URL"
                />
              </div>
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
