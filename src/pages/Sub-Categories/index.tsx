import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useTranslation } from "react-i18next";
 import _ from "lodash";
import { decodeId, encodeId } from "../../utils";
import { Link, useNavigate, useParams } from "react-router";
import { PlusIcon, TrashIcon ,PencilIcon } from "../../components/svgs";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { AppRoutes } from "../../constants";
import { useGetSubCategories } from "../../services/api-hooks/subCategoryHooks";
import INF from "../../icons/images/image-not-found.png";
const Index = () => {
  const { t } = useTranslation();
  const {category_id} = useParams()
   const { data } = useGetSubCategories({
     category_id: Number(decodeId(String(category_id))),
   });
  const navigate = useNavigate();
  const { closeModal, isOpen, openModal } = useModal();
   return (
     <>
       <div>
         <PageMeta
           title={`${t("modules.sub-categories")} | Swiggy`}
           description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
         />
         <PageBreadcrumb pageTitle={t("modules.sub-categories")} />
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 h-full">
           {_.map(data?.data?.rows, (subCategory) => (
             <div
               key={subCategory?.id}
               className="relative group cursor-pointer"
               onClick={() =>
                 navigate("/sub-category/" + encodeId(Number(subCategory?.id)))
               }
             >
               <div className="col-span-1">
                 <ComponentCard
                   image={{
                     className: "w-50 h-50",
                     src: subCategory?.image ?? INF,
                     isCenter: true,
                   }}
                 >
                   <p className="text-xl m-0 dark:text-gray-200">
                     {subCategory?.name}
                   </p>
                   <p className="text-sm dark:text-gray-500 text-wrap line-clamp-2">
                     {subCategory?.short_description}
                   </p>
                 </ComponentCard>
               </div>
               <span
                 onClick={() =>
                   navigate(`/subCategory/${encodeId(Number(subCategory?.id))}`)
                 }
                 className="z-1 cursor-pointer absolute top-4 right-[-2.75rem]   text-white rounded-tr-lg rounded-br-lg p-2 text-xs transform -translate-x-3 opacity-0 group-hover:-translate-x-2 group-hover:opacity-100 hover:-translate-x-2 hover:opacity-90 transition-all duration-300 ease-in-out bg-warning-500"
               >
                 <PencilIcon className="w-5 h-5 p-0.5 !text-white" />
               </span>
               <span
                 onClick={openModal}
                 className="z-1  cursor-pointer absolute top-16 right-[-2.75rem]   text-white rounded-tr-lg rounded-br-lg p-2 text-xs transform -translate-x-3 opacity-0 group-hover:-translate-x-2 group-hover:opacity-90 hover:-translate-x-2 hover:opacity-100 transition-all duration-300 ease-in-out bg-error-500"
               >
                 <TrashIcon className="w-5 h-5" />
               </span>
             </div>
           ))}
         </div>
       </div>
       <div className="w-full absolute right-10 bottom-5 flex justify-end">
         <Link
           to={AppRoutes.ADD_SUB_CATEGORY}
           className=" sticky !rounded-full !p-3 bg-brand-500"
         >
           <span className="text-white z-10">
             <PlusIcon className="w-5 h-5 p-0.5 " />
           </span>
         </Link>
       </div>

       <Modal isOpen={isOpen} onClose={closeModal} className="w-full max-w-md">
         <div className="p-6">
           <h2 className="text-lg dark:text-white/90 font-semibold">
             {t(`delete-subCategory`)}?
           </h2>
           <p className="mt-2 text-gray-600">
             {t(`modal-messages.delete-subCategory`)}
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
