import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne, {
  ITableHeaderProps,
} from "../../components/tables/BasicTables/BasicTableOne";
import { useGetRole } from "../../services/api-hooks/roleHooks";
import { useParams } from "react-router";
import { decodeId } from "../../utils";
import { IRole } from "../../types";
import _ from "lodash";
import Checkbox from "../../components/form/input/Checkbox";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../components/form/input/InputField";

const fields: (keyof IRole)[] = ["id", "name", "permissions", "is_admin"];

const validationSchema = Yup.object().shape({
  id: Yup.number().label("Id").nullable(),
  name: Yup.string().label("Name").required(),
  permissions: Yup.object().shape({}).nullable(),
  is_admin: Yup.boolean().label("Is Admin").default(false),
});

const AddEditRole = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [roleDetails, setRoleDetails] = useState<Partial<IRole> | null>(null);
  const { data, isSuccess } = useGetRole(decodeId(String(id)));

  const handleRoleSubmit = (values: FormikValues) => {
    console.log(values);
  };

  const {
    values,
    handleSubmit,
    setFieldValue,
    handleChange,
    touched,
    errors,
    handleBlur,
  } = useFormik({
    initialValues: _.defaults(
      _.pick(roleDetails, fields),
      Object.fromEntries(fields.map((field) => [field, undefined]))
    ),
    onSubmit: handleRoleSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
  });

  const handleChangePermission = (
    key: string,
    value: "write" | "read" | "delete" | "update"
  ) => {
    const existing: Array<"write" | "read" | "delete" | "update"> =
      (values.permissions?.[key] as Array<
        "write" | "read" | "delete" | "update"
      >) || [];

    const updated = existing.includes(value)
      ? _.without(existing, value)
      : _.sortBy(_.union(existing, [value]));

    setFieldValue(`permissions.${key}`, updated);
  };

  useEffect(() => {
    if (isSuccess) {
      setRoleDetails(data?.data as Partial<IRole>);
    }
  }, [data?.data, isSuccess]);

  const columns: Array<
    ITableHeaderProps<Record<string, "write" | "read" | "delete" | "update">>
  > = [
    {
      header: t("feature") + " " + t("name"),
      name: "name",
      cell: (__, key) => {
        return <span>{_.capitalize(key as string)}</span>;
      },
    },
    {
      header: t("feature") + " " + t("permission"),
      name: "permissions",
      cell: (props, key) => {
        return (
          <div className="flex flex-wrap gap-x-6 ">
            {_.map(props, (value: "write" | "read" | "delete" | "update") => {
              return (
                <div
                  className="flex items-center gap-x-2"
                  key={`${key}-${value}`}
                >
                  <span key={key}>
                    <Checkbox
                      checked={
                        !!(
                          key &&
                          value &&
                          (
                            values.permissions?.[key] as Array<
                              "write" | "read" | "delete" | "update"
                            >
                          )?.includes(value)
                        )
                      }
                      name={`permission.${key}.${value}`}
                      onChange={() => {
                        handleChangePermission(key as string, value);
                      }}
                    />
                  </span>
                  <span className="text-sm">{_.capitalize(value)}</span>
                </div>
              );
            })}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageMeta
        title={`${t("modules.roles")} | Swiggy`}
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={t("modules.add-role")} />
      <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          <ComponentCard
            title={t("add-role")}
            saveButton={{
              label: t("button.save"),
              type: "submit",
            }}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-1">
                <Input
                  label={t("name")}
                  name="name"
                  isRequired
                  values={values}
                  errors={errors}
                  touched={touched}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error
                />
              </div>
            </div>
            <BasicTableOne
              columns={columns}
              data={roleDetails?.permissions || {}}
            />
          </ComponentCard>
        </form>
      </div>
    </div>
  );
};

export default AddEditRole;
