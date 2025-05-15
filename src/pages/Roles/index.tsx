import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useTranslation } from "react-i18next";
import { useGetRoles } from "../../services/api-hooks/roleHooks";
import ComponentCard from "../../components/common/ComponentCard";
import { useNavigate } from "react-router";
import { AppRoutes, FEATURES_NAME } from "../../constants/index";
import BasicTableOne, {
  ITableHeaderProps,
} from "../../components/tables/BasicTables/BasicTableOne";
import _ from "lodash";
import { IRole } from "../../types/index";
import { encodeId } from "../../utils/index";
import { PencilIcon } from "../../components/svgs/index";
import Button from "../../components/ui/button/Button";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useGetRoles();
  const columns: ITableHeaderProps<IRole>[] = [
    {
      header: "Name",
      name: "name",
      cell: (props) => (
        <span className="flex !w-60">{props.name as string}</span>
      ),
    },
    {
      header: "Permissions",
      name: "permissions",
      cell: (props) => {
        console.log("🚀 ~ Index ~ props:", props)
        return (
          <div className="flex flex-wrap gap-2 ">
            {_.map(props.permissions, (permission, key) => (
              <span
                key={key}
                className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
              >
                {`${_.capitalize(
                  FEATURES_NAME[key as keyof typeof FEATURES_NAME] ?? key
                )} : ${_.join(_.sortBy(permission), ", ")}`}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Actions",
      name: "actions",
      cell: (props) => (
        <div className="flex gap-2 !w-30">
          <Button
            className="!p-2"
            onClick={() => {
              navigate(`/role/${encodeId(Number(props.id))}`);
            }}
          >
            <PencilIcon className="w-5 h-5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageMeta
        title={`${t("modules.roles")} | Swiggy`}
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={t("modules.roles")} />
      <div className="space-y-6">
        <ComponentCard
          title={t("modules.roles")}
          button={{
            label: t("add-role"),
            onClick: () => {
              navigate(AppRoutes.ADD_ROLE);
            },
          }}
        >
          <BasicTableOne columns={columns} data={data?.data} />
        </ComponentCard>
      </div>
    </div>
  );
};

export default Index;
