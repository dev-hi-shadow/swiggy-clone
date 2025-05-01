import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons/svgs";
import { useTranslation } from "react-i18next";
import _ from "lodash";

export default function MonthlyTarget() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="min-h-full  bg-white rounded-2xl border border-gray-200  dark:border-gray-800 dark:bg-gray-900">
      <div className=" px-5 pt-5  shadow-default rounded-2xl   sm:px-6 sm:pt-6">
        <div className="sticky top-0 flex justify-between  ">
          <div>
            <h3 className="text-2xl  font-semibold text-gray-800 dark:text-white/90">
              {t("new-orders")}
            </h3>
          </div>
          <div className="relative inline-block ">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="border-1 border-t  border-gray-300 dark:border-gray-800  my-3"></div>
        <div className="overflow-y-auto flex  flex-col gap-y-5 custom-scrollbar max-h-[280px]">
          {_.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (i) => (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    Product Name {i}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 w-100 truncate">
                    Product DescriptionProduct DescriptionProduct
                    DescriptionProduct DescriptionProduct DescriptionProduct
                    DescriptionProduct DescriptionProduct DescriptionProduct
                    DescriptionProduct DescriptionProduct DescriptionProduct
                    DescriptionProduct Description
                  </p>
                  <p className="text-sm text-blue-500 ">show more</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  $100
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
