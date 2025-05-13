import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useTranslation } from "react-i18next";
 import _ from "lodash";
import { encodeId } from "../../utils";
import { Link, useNavigate } from "react-router";
import { PlusIcon, TrashIcon, PencilIcon } from "../../components/svgs";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { AppRoutes } from "../../constants";
import { useGetDishes } from "../../services/api-hooks/dishHooks";
import Badge from "../../components/ui/badge/Badge";
import { useState } from "react";


const categories = [
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
]
const Index = () => {
  const { t } = useTranslation();
  const { data } = useGetDishes();
  const navigate = useNavigate();
  const [ActiveCategories, setActiveCategories] = useState<number[]>([]);
  const { closeModal, isOpen, openModal } = useModal();

  const HandleActiveCategory = (id: number) => {
    if (ActiveCategories.includes(id)) {
      if (id === 0 && ActiveCategories.length === categories.length) {
        setActiveCategories([]);
      } else {
        setActiveCategories(ActiveCategories.filter((item) => item !== id));
      }
    } else {
      if (id === 0) {
        setActiveCategories(_.map(categories, "id"));
      } else {
        setActiveCategories((prev) =>  [...prev, id]);
      }
    }
  };
  return (
    <>
      <div>
        <PageMeta
          title={`${t("modules.dishes")} | Swiggy`}
          description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />

        <div className="grid grid-cols-3 items-center">
          <div className="col-span-2 flex items-center gap-x-12 ">
            <p className="text-title-sm font-outfit dark:text-gray-300">
              Food management
            </p>
            <p className="text-title-sm font-outfit dark:text-gray-300">
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
            </p>
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
      <div className="mt-6">
        <div className="flex w-full no-scrollbar flex-nowrap overflow-x-auto">
          <div className="flex gap-2 no-scrollbar">
            {categories.map((category) => (
              <span
                className={`cursor-pointer px-10 text-center py-2.5 rounded-full ${
                  _.includes(ActiveCategories, category.id)
                    ? ` bg-brand-500/80`
                    : ` bg-brand-400/10`
                } border-1 border-brand-500/80 text-white/80`}
                key={category.id}
                onClick={() => HandleActiveCategory(category.id)}
              >
                {category.name}
              </span>
            ))}
          </div>
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
