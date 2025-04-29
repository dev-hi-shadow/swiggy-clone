import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne, {
  ITableHeaderProps,
} from "../../components/tables/BasicTables/BasicTableOne";
import { AppRoutes } from "../../constants";
import { useNavigate } from "react-router";
import { useGetRestaurants } from "../../services/api-hooks/restaurantsHook";
import Switch from "../../components/form/switch/Switch";
import { IRestaurant } from "../../types";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";
import { InstagramIcon } from "../../components/svgs";

const Index = () => {
  const navigate = useNavigate();
  const { data } = useGetRestaurants();
  const { isOpen, openModal, closeModal } = useModal();
  const [deleteRestaurantId, setDeleteRestaurantId] = useState<number | null>(
    null
  );

  const handleActiveChange = (id: number, value: boolean) => {
    console.log("Active/Deactive", id, value);
  };

  const handleDeleteRestaurant = () => {
    console.log("Delete restaurant", deleteRestaurantId);
    closeModal();
    setDeleteRestaurantId(null);
  };

  const columns: ITableHeaderProps[] = [
    {
      header: "Name",
      name: "name",
      cell: (props: object) => (props as IRestaurant).name as string,
    },
    {
      header: "GST Number",
      name: "gst_number",
      cell: (props: object) => (props as IRestaurant).gst_number as string,
    },
    {
      header: "Owner",
      name: "owner",
      cell: (props: object) =>
        (props as IRestaurant).owner?.first_name as string,
    },
    {
      header: "Status",
      name: "status",
      cell: (props: object) => (
        <Switch
          name="status"
          defaultChecked={false}
          onChange={(value) =>
            handleActiveChange((props as IRestaurant).id, value)
          }
        />
      ),
    },
    {
      header: "Phone Number",
      name: "phone_number",
      cell: (props: object) => (props as IRestaurant).phone_number as string,
    },
    {
      header: "Social Links",
      name: "status",
      cell: (props: object) => {
        return (
          <div className="flex items-center space-x-2">
            {(props as IRestaurant).facebook_url && (
              <a
                href={(props as IRestaurant).facebook_url ?? ""}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/assets/images/icons/facebook.svg"
                  alt="facebook"
                  className="w-5 h-5"
                />
              </a>
            )}
            {(props as IRestaurant).website_url && (
              <a
                href={(props as IRestaurant).website_url ?? ""}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/assets/images/icons/website.svg"
                  alt="website"
                  className="w-5 h-5"
                />
              </a>
            )}

            {(props as IRestaurant).instagram_url && (
              <a
                href={(props as IRestaurant).instagram_url ?? ""}
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon />
              </a>
            )}
          </div>
        );
      },
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
              navigate("/restaurant/" + (props as IRestaurant).id);
            }}
          >
            Edit
          </Button>
          <Button
            className="text-theme-primary"
            size="sm"
            onClick={() => {
              openModal();
              setDeleteRestaurantId((props as IRestaurant).id);
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
        title="Restaurants | Swiggy"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Restaurants" />
      <div className="space-y-6">
        <ComponentCard
          title="Restaurants"
          button={{
            label: "Add Restaurant",
            onClick: () => {
              navigate(AppRoutes.ADD_RESTAURANT);
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
              Are you sure you want to delete this restaurant?
            </p>
            <div className="flex items-center justify-end mt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  closeModal();
                  setDeleteRestaurantId(null);
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
