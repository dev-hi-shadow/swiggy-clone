import _ from "lodash";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import { useGetRestaurants } from "../services/api-hooks/restaurantsHook";
import { queryClient } from "../services/QueryClient";
import { AppRoutes } from "../constants";
import { useNavigate } from "react-router";
import { IActiveRBranch, IRestaurant } from "../types";

export default function SwitchRestaurant() {
  const { data } = useGetRestaurants();
  const navigate = useNavigate();
  const handleSelectRestaurant = (restaurant: Partial<IRestaurant>) => {
    queryClient.setQueryData(["activeRestaurant"], {
      id: restaurant?.id,
      name: restaurant?.name,
    });
    if (_.size(restaurant.branches) === 1) {
      const branch = _.first(restaurant.branches);
      queryClient.setQueryData<IActiveRBranch>(["activeRBranch"], {
        id: Number(restaurant?.id),
        dayOff: Boolean(branch?.is_open),
        location: branch?.location as string,
        orderAccepting: Boolean(
          branch?.is_available_for_delivery && branch?.is_available_for_pickup
        ),
      });
      //  queryClient.invalidateQueries({ queryKey: ["activeRBranch"] });
      navigate(AppRoutes.DASHBOARD);
    } else {
      navigate(AppRoutes.SWITCH_BRANCHES);
    }
  };
  return (
    <div>
      <PageMeta
        title="Select Restaurants | Swiggy"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="min-h-screen flex justify-center items-center rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {_.map(data?.data, (restaurant) => (
          <div onClick={() => handleSelectRestaurant(restaurant)}>
            <ComponentCard
              title={
                <div className="flex items-center w-[100%] justify-center">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYS66oL8Fy0MrAnJGC_sI_FCcQ-0f0t0R1wQ&s"
                    className="rounded-2xl"
                    alt="Restaurant"
                  />
                </div>
              }
            >
              <div className="flex flex-col items-center justify-center">
                <h3 className="mb-4 text-center text-2xl font-medium text-gray-800 dark:text-white/90">
                  {restaurant?.name}
                </h3>
              </div>
            </ComponentCard>
          </div>
        ))}
      </div>
    </div>
  );
}
