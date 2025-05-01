import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { IUser } from "../types";
import { useGetUserDetails } from "../services/api-hooks/usersHook";

export default function UserProfiles() {
  const [userDetails, setUserDetails] = useState<Partial<IUser> | null>(null);
   const { data, isSuccess } = useGetUserDetails();
   useEffect(() => {
     if (isSuccess) {
       setUserDetails(data?.data ?? null);
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSuccess]);

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard userDetails={userDetails} />
          <UserInfoCard
            setUserDetails={setUserDetails}
            userDetails={userDetails}
          />
          <UserAddressCard
            setUserDetails={setUserDetails}
            userDetails={userDetails}
          />
        </div>
      </div>
    </>
  );
}
