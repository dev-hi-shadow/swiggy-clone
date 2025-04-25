import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { AppRoutes } from "../../constants";
import { useNavigate } from "react-router";
import { useGetRestaurants } from "../../services/api-hooks/restaurantsHook";

const Index = () => {
  const navigate = useNavigate();
    const { data } = useGetRestaurants();
    console.log("🚀 ~ Index ~ data:", data)
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
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
};

export default Index;
