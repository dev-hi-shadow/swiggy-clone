import React, { useEffect } from 'react'
import PageMeta from '../../components/common/PageMeta';
import { useTranslation } from 'react-i18next';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import BasicTableOne, { ITableHeaderProps } from "../../components/tables/BasicTables/BasicTableOne";
import { useGetRole } from '../../services/api-hooks/roleHooks';
import { useParams } from 'react-router';
import { decodeId } from '../../utils';
import { IRole } from '../../types';
import _ from "lodash";
import Checkbox from '../../components/form/input/Checkbox';
import { useFormik } from 'formik';

const AddEditRole = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [roleDetails, setRoleDetails] = React.useState<Partial<IRole>>({});
   const { data, isSuccess } = useGetRole(decodeId(String(id)));

  //  const { values, errors, handleChange, handleSubmit, setFieldValue } =
  //    useFormik({});

  useEffect(() => {
    if (isSuccess) {
      setRoleDetails(data?.data as Partial<IRole>);
    }
  }, [data?.data, isSuccess]);
  
  const columns: Array<
    ITableHeaderProps<Record<string, "write" | "read" | "delete" | "update">>
  > = [
    {
      header: "Name",
      name: "name",
      cell: (__, key) => {
        return <span>{_.capitalize(key as string)}</span>;
      },
    },
    {
      header: "Permissions",
      name: "permissions",
      cell: (props, key) => {
        return (
          <div className="flex flex-wrap gap-2">
            {_.map(props, (value) => {
              return (
                <span
                  key={key}
                  className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                >
                  {/* <Checkbox name={`${key}.${value}`} onChange={handleChange} /> */}
                  {value}
                </span>
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
         <ComponentCard title={t("add-role")}>
           <BasicTableOne
             columns={columns}
             data={roleDetails.permissions || {}}
           />
         </ComponentCard>
       </div>
     </div>
   );
}

export default AddEditRole