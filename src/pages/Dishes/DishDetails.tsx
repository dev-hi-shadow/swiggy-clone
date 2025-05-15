import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useGetDish } from "../../services/api-hooks/dishHooks";
import { useParams } from "react-router";
import { decodeId } from "../../utils";

const DishDetails = () => {
  const { id } = useParams();
  const { data: Dish } = useGetDish(Number(decodeId(String(id))));
  console.log("🚀 ~ DishDetails ~ data:", Dish);
  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={Dish?.data?.name as string} />

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 h-full"></div>
    </div>
  );
};

export default DishDetails;
