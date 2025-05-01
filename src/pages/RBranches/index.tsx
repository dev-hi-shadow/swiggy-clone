import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne, {
  ITableHeaderProps,
} from "../../components/tables/BasicTables/BasicTableOne";
import { AppRoutes } from "../../constants";
import { useNavigate, useParams } from "react-router";
 import Switch from "../../components/form/switch/Switch";
import { IRBranch,   } from "../../types";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";
 import { useTranslation } from "react-i18next";
import { decodeId, encodeId,   } from "../../utils";
import { useGetRBranches } from "../../services/api-hooks/branchHooks";
 
const Index = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const [, setDeleteRBranchId] = useState<number | null>(null);

  const handleActiveChange = (id: number, value: boolean) => {
    console.log("Active/Deactive", id, value);
  };

  const { data } = useGetRBranches(decodeId(id as string));

  const handleDeleteRestaurant = () => {
    closeModal();
    setDeleteRBranchId(null);
  };

  const columns: ITableHeaderProps<IRBranch>[] = [
    {
      header: "Name",
      name: "name",
      cell: (props) => t(props.location as string),
    },
    {
      header: "GST Number",
      name: "gst_number",
      cell: (props) => t(props.gst_number as string),
    },
    {
      header: "Owner",
      name: "owner",
      cell: (props) =>
        (props.owner?.first_name as string) +
        " " +
        (props.owner?.last_name as string),
    },
    {
      header: "Status",
      name: "status",
      cell: (props) => (
        <Switch
          name="status"
          defaultChecked={false}
          className="!gap-0"
          onChange={(value) => handleActiveChange(Number(props.id), value)}
        />
      ),
    },
    {
      header: "Phone Number",
      name: "phone_number",
      cell: (props) => props.phone_number as string,
    },
    {
      header: "Action",
      name: "action",
      cell: (props) => (
        <div className="flex items-center space-x-2">
          <Button
            className="text-theme-primary"
            size="sm"
            onClick={() => {
              navigate("/branch/" + encodeId(Number(props.id)));
            }}
          >
            Edit
          </Button>
          <Button
            className="text-theme-primary"
            size="sm"
            onClick={() => {
              openModal();
              setDeleteRBranchId(Number(props.id));
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageMeta
        title={`Branches | Swiggy`}
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={t("branches")} />
      <div className="space-y-6">
        <ComponentCard
          title="Branches"
          button={{
            label: "Add Branch",
            onClick: () => {
              navigate(AppRoutes.ADD_BRANCH);
            },
          }}
        >
          <BasicTableOne columns={columns} data={data?.data} />
        </ComponentCard>
      </div>
      {/* Confirmation Modal */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal} className="w-full max-w-md">
          <div className="p-6">
            <h2 className="text-lg dark:text-white/90 font-semibold">
              Delete Confirmation
            </h2>
            <p className="mt-2 text-gray-600">
              {t("modal-messages.delete-branch-message")}
            </p>
            <div className="flex items-center justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  closeModal();
                  setDeleteRBranchId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-error-500 dark:hover:bg-error-800 hover:bg-error-600"
                onClick={handleDeleteRestaurant}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Index;
