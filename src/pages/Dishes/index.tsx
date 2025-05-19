import PageMeta from "../../components/common/PageMeta";

import { useTranslation } from "react-i18next";
import _ from "lodash";

import { Link, useNavigate } from "react-router";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { AppRoutes } from "../../constants";
import { useGetDishByCategory } from "../../services/api-hooks/dishHooks";
import { useState } from "react";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { IDish, IPagination } from "../../types";
import { encodeId } from "../../utils";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
  

const categories = _.sortBy(
  [
    {
      id: 0,
      name: "All",
    },
    {
      id: 2,
      name: "Veg",
    },
    {
      id: 3,
      name: "Non-Veg",
    },
    {
      id: 4,
      name: "Snacks",
    },
    {
      id: 5,
      name: "Drinks",
    },
    {
      id: 6,
      name: "Desserts",
    },
    {
      id: 7,
      name: "Others",
    },
    {
      id: 8,
      name: "Beverages",
    },
  ],
  "name"
);
const Index = () => {
  const { t } = useTranslation()
  const [pagination] = useState<null | IPagination<IDish>>({
    page: 1,
    limit: 10,
    filter: {},
    sortOrder: "asc",
  });
  const { data } = useGetDishByCategory(pagination);
   const navigate = useNavigate();
 
 
   const [ActiveCategories, setActiveCategories] = useState<number[]>([]);
  const { closeModal, isOpen } = useModal();
  const [view, setView] = useState<"by-category" | "by-restaurant">(
    "by-category"
  );
  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);

  function toggleDropdown() {
    setIsOpenDropDown((prev) => !prev);
  }
  function closeDropdown(fn?: () => void) {
    if (fn) fn();
    setIsOpenDropDown(false);
  }
  const HandleActiveCategory = (id: number) => {
    setActiveCategories((prev) =>
      id === 0
        ? _.isEqual(prev, _.map(categories, "id"))
          ? []
          : _.map(categories, "id")
        : _.xor(prev, [id])
    );
  };
  return (
    <>
      <div>
        <PageMeta
          title={`${t("modules.dishes")} | Swiggy`}
          description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />

        <PageBreadcrumb pageTitle={t("modules.dishes")} />

        <div className="grid grid-cols-4 items-center">
          <div className="col-span-3 flex md:flex-row items-center gap-x-12 ">
            <div className="text-title-sm font-outfit dark:text-gray-300">
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search or type dish name..."
                  className="dark:bg-dark-900 h-11 w-full rounded-full border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800  dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />
              </div>
            </div>

            <div className="relative justify-self-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDropdown()}
                className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
              >
                <span className="block mr-1 font-medium text-sm dark:text-gray-300 text-nowrap">
                  View : {t(view as string)}
                </span>
                <svg
                  className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>

              <Dropdown
                isOpen={isOpenDropDown}
                onClose={closeDropdown}
                className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
              >
                <ul className="flex flex-col gap-1  ">
                  <li>
                    <DropdownItem
                      onItemClick={() =>
                        closeDropdown(() => setView("by-category"))
                      }
                      className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      {t("by-category")}
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      onItemClick={() =>
                        closeDropdown(() => setView("by-restaurant"))
                      }
                      className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      {t("by-restaurant")}
                    </DropdownItem>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>

          <div className="col-span-1 justify-self-end">
            <Link
              to={AppRoutes.ADD_DISH}
              className="rounded-full  !p-3 !px-10 bg-brand-500"
            >
              <span className="text-white z-10">Add Dish</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="   my-6">
        <div className="  flex w-full no-scrollbar flex-nowrap overflow-x-auto">
          <div className="flex gap-2 no-scrollbar">
            {data?.data?.rows.map((category) => (
              <span
                className={`cursor-pointer px-10 text-center text-nowrap py-2.5 rounded-full ${
                  _.includes(ActiveCategories, category?.id)
                    ? ` bg-brand-500/80`
                    : ` bg-brand-400/10`
                } border-1 border-brand-500/80 text-white/80`}
                key={category?.id}
                onClick={() => HandleActiveCategory(Number(category?.id))}
              >
                {category?.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="flex gap-y-14 flex-col h-full overflow-y-auto">
          {_.map(data?.data?.rows, (category) => {
            return (
              <div key={category.id} className="flex flex-col gap-y-4">
                <p className=" dark:text-gray-300 font-poppins text-xl ">
                  {category?.name}
                </p>
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-x-6 min-w-max">
                    {_.isArray(category?.dishes) &&
                      category?.dishes?.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 bg-white rounded-xl shadow-md dark:bg-gray-800 "
                        >
                          <div
                            className="relative flex items-center justify-center w-50 h-50 bg-cover bg-center rounded-lg overflow-hidden cursor-pointer"
                            onClick={() =>
                              navigate(`/dish/de/${encodeId(item?.id)}`)
                            }
                            style={{ backgroundImage: `url('${item.image}')` }}
                          >
                            <div className="absolute bottom-0 left-0 right-0 h-1/4 flex justify-center items-center bg-black/60">
                              <span className="text-gray-100 dark:text-gray-300 font-medium text-lg">
                                {item.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg dark:text-white/90 font-semibold">
            {t(`delete-category`)}?
          </h2>
          <p className="mt-2 text-gray-600">
            {t(`modal-messages.delete-category`)}
          </p>
          <div className="flex items-center justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="bg-error-500  hover:bg-error-600">
              {t(`button.delete`)}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Index;
