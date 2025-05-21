import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useGetDish } from "../../services/api-hooks/dishHooks";
import {  useParams } from "react-router";
import { decodeId } from "../../utils";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import ComponentCard from "../../components/common/ComponentCard";
import _ from "lodash";
import ComponentBox from "../../components/common/ComponentBox";
import { FilledHeartIcon, PlusIcon } from "../../components/svgs";
import { FormikValues, useFormik } from "formik";
import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import { IDCOption, IDCustomization } from "../../types";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import ResponsiveImage from "../../components/ui/images/ResponsiveImage";

const DCOptionFields: (keyof IDCOption)[] = [
  "calories",
  "customization_id",
  "id",
  "is_available",
  "is_default",
  "order",
  "price",
  "title",
];

const DishDetails = () => {
  const { values, setFieldValue } = useFormik({
    initialValues: {
      image: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYDC-hoXz8vxf-crJcUaSnUAjzB8F8bCHfmQ&s",
      ],
      banner_image: "",
    },
    onSubmit: () => {},
  });
  const [IsOpenCustomizationModal, setIsOpenCustomizationModal] =
    useState<boolean>(false);
  const [addEditOptionModal, setAddEditOptionModal] = useState<null | IDCustomization>(
    null
  );
  const [addEditDCOption, setAddEditDCOption] = useState<null | IDCOption>(
    null
  );
  const { id } = useParams();
  const { data: Dish } = useGetDish(Number(decodeId(String(id))));


  const HandleAddEditDCOption = (values : FormikValues)=>{
    console.log(values);
  }


  const CustomizationFormik = useFormik({
    initialValues: _.defaults(
      _.pick(addEditDCOption, DCOptionFields),
      Object.fromEntries(DCOptionFields.map((field) => [field, undefined]))
    ),
    onSubmit: HandleAddEditDCOption,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  

  console.log("CustomizationFormik" ,CustomizationFormik.values)
  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={Dish?.data?.name as string} />
      <div className="grid grid-cols-1 h-fit gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6 mb-5">
        <ComponentBox
          Icon={<FilledHeartIcon />}
          title="Likes"
          value="3,782"
          badge={{
            label: "11.01%",
            color: "success",
            icon: <FilledHeartIcon className="w-4 h-4" />,
          }}
        />
        <ComponentBox
          Icon={<FilledHeartIcon />}
          title="Likes"
          value="3,782"
          badge={{
            label: "11.01%",
            color: "success",
            icon: <FilledHeartIcon className="w-4 h-4" />,
          }}
        />
        <ComponentBox
          Icon={<FilledHeartIcon />}
          title="Likes"
          value="3,782"
          badge={{
            label: "11.01%",
            color: "success",
            icon: <FilledHeartIcon className="w-4 h-4" />,
          }}
        />
        <ComponentBox
          Icon={<FilledHeartIcon />}
          title="Likes"
          value="3,782"
          badge={{
            label: "11.01%",
            color: "success",
            icon: <FilledHeartIcon className="w-4 h-4" />,
          }}
        />
      </div>
      <div className="flex  gap-4 xl:flex-row flex-col h-fit">
        <div className="xl:w-2/4 gap-4 sm:w-full  flex flex-row">
          <DropzoneComponent
            values={values}
            setFieldValue={setFieldValue}
            className="w-1/2 "
            name="image"
            label="Image"
          />
          <DropzoneComponent
            values={values}
            setFieldValue={setFieldValue}
            name="banner_image"
            className="w-1/2 "
            label="Banner Image"
          />
        </div>
        <div className="xl:w-1/2 sm:w-full">
          {!Dish?.data?.is_customizable ? null : (
            <ComponentCard
              className="h-full"
              button={{
                label: "Edit Customization Options",
                onClick: () => setIsOpenCustomizationModal(true),
                size: "xs",
              }}
              title="Customization"
            >
              <p className="dark:text-gray-300 text-xs ">
                Name : Selection Type : Min Selection : Max Selection : Options
              </p>
              {_.map(Dish?.data?.customization_groups, (group) => (
                <div>
                  <p className="dark:text-gray-300 font-medium ">
                    {group?.title}
                    <span className="text-error-500">
                      {group.is_required ? "* " : " "}
                    </span>
                    : {_.startCase(group.selection_type)} :{" "}
                    {group.min_selection} : {group.max_selection}
                  </p>
                  {_.size(group.options) ? (
                    <div className="flex flex-nowrap overflow-x-auto gap-x-3">
                      {_.map(group.options, (option) => (
                        <div className="flex  gap-x-2 dark:bg-gray-800 bg-gray-200 px-1 rounded-lg">
                          <p className=" dark:text-gray-300">{option.title}</p>
                          <p className=" dark:text-gray-300">
                            - ₹{option.price}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </ComponentCard>
          )}
        </div>
      </div>
      <Modal
        isOpen={IsOpenCustomizationModal}
        onClose={() => setIsOpenCustomizationModal(false)}
        className="w-full max-w-5xl"
        showCloseButton
      >
        <div className="no-scrollbar relative   overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-7">
          <div
            className="px-2 pr-14
           border-b border-gray-200 dark:border-gray-800"
          >
            <h4 className=" text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Customization
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Add more options to your dish to make it more delicious
            </p>
          </div>
          <div className="p-2 py-5 flex flex-col gap-y-4">
            {_.map(Dish?.data?.customization_groups, (group) => {
              return (
                <div key={group.id}>
                  <p className="font-semibold text-lg dark:text-gray-300 mb-2">
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-x-10 overflow-x-auto dark:text-gray-300   ">
                    <div
                      className="text-sm flex flex-col items-center justify-center  hover:scale-98 duration-200 transition-all rounded-xl h-30 w-30 border-dashed border border-brand-500 cursor-pointer"
                      onClick={() => setAddEditOptionModal(group)}
                    >
                      <PlusIcon className="w-5 h-5" />
                      Add Option
                    </div>
                    {_.map(group?.options || [], (option) => {
                      return (
                        <div
                          className="flex flex-col gap-y-2 w-30"
                          onClick={() => {
                            setAddEditDCOption(option);
                            setAddEditOptionModal(group);
                          }}
                        >
                          <div
                            key={option.id}
                            className="text-sm flex flex-col items-center justify-center  rounded-xl h-30  border-dashed border border-brand-500"
                          >
                            <ResponsiveImage image={option?.image} />
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <p className=" text-wrap">{option.title}</p>
                            <p className="">
                              {option.price ? `₹${option.price}` : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(addEditOptionModal)}
        onClose={() => {
          setAddEditDCOption(null);
          setAddEditOptionModal(null);
        }}
        className="w-full max-w-5xl"
        showCloseButton
      >
        <div className="no-scrollbar relative   overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-7">
          <div
            className="px-2 pr-14
           border-b border-gray-200 dark:border-gray-800"
          >
            <h4 className=" text-2xl font-semibold text-gray-800 dark:text-white/90">
              {_.capitalize(addEditOptionModal?.title)} Customization
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Add more {_.lowerCase(addEditOptionModal?.title)} options to your
              dish to make it more delicious
            </p>
          </div>
          <form onSubmit={CustomizationFormik.handleSubmit}>
            <div className="p-2 py-5 flex flex-col gap-y-4">
              {/* grid wise form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <DropzoneComponent name="image" label="Image" />
                </div>
                <div className="col-span-1 flex flex-col">
                  <Input
                    className="mb-5"
                    name="title"
                    label="Title"
                    onChange={CustomizationFormik.handleChange}
                    values={CustomizationFormik.values}
                    errors={CustomizationFormik.errors}
                    touched={CustomizationFormik.touched}
                    onBlur={CustomizationFormik.handleBlur}
                    isRequired
                  />
                  <Input
                    className="mb-5"
                    type="number"
                    name="price"
                    label="Price"
                    isRequired
                    onChange={CustomizationFormik.handleChange}
                    values={CustomizationFormik.values}
                    errors={CustomizationFormik.errors}
                    touched={CustomizationFormik.touched}
                    onBlur={CustomizationFormik.handleBlur}
                  />
                  <div className="flex flex-row gap-5">
                    <Checkbox
                      values={CustomizationFormik.values}
                      errors={CustomizationFormik.errors}
                      touched={CustomizationFormik.touched}
                      setFieldValue={CustomizationFormik.setFieldValue}
                      name="is_default"
                      label="is Default"
                    />
                    <Checkbox
                      values={CustomizationFormik.values}
                      errors={CustomizationFormik.errors}
                      touched={CustomizationFormik.touched}
                      setFieldValue={CustomizationFormik.setFieldValue}
                      name="is_available"
                      label="Is Available"
                    />
                  </div>
                  <div className="flex flex-row justify-end items-end h-full gap-5">
                    <Button
                      type="reset"
                      variant="outline"
                      onClick={() => {
                        setAddEditOptionModal(null);
                        CustomizationFormik.resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default DishDetails;
