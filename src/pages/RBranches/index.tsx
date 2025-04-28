import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { AppRoutes } from "../../constants";
import { useNavigate, useParams } from "react-router";

import { useGetUserDetails } from "../../services/api-hooks/usersHook";
import { useGetRestaurant } from "../../services/api-hooks/restaurantsHook";
import { encodeId } from "../../utils";
import { useGetRBranches } from "../../services/api-hooks/branchHooks";

const Index = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const UserProfile = useGetUserDetails();
  const RestaurantData = useGetRestaurant(
    Number(encodeId(Number(id)))
  );

  const { data } = useGetRBranches();
  return (
    <div>
      <PageMeta
        title="Branches | Swiggy"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Branches" />
      <div className="space-y-6">
        <ComponentCard
          title={`${
            !UserProfile?.data?.data?.role?.is_admin
              ? "Your"
              : RestaurantData.data?.data?.name
          } Branches `}
          button={{
            label: "Add Branch",
            onClick: () => {
              navigate(AppRoutes.ADD_BRANCH);
            },
          }}
        >
          <BasicTableOne columns={[]} data={data?.data} />
        </ComponentCard>
      </div>
    </div>
  );
};

export default Index;
