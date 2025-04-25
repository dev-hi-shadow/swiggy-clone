import React from 'react'
import PageMeta from '../../components/common/PageMeta';
import { useParams } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Input from '../../components/form/input/InputField';

const AddEditRestaurant = () => {
  const {id} = useParams()
  return (
    <div>
      <PageMeta
        title={id ? "Edit Restaurant" : "Add Restaurant"}
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={id ? "Edit Restaurant" : "Add Restaurant"} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <ComponentCard title="Information">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
          </div>
        </ComponentCard>
        <ComponentCard title="Image">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-7">
        <ComponentCard title="Location Information">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
          </div>
        </ComponentCard>
        <ComponentCard title="legal Information">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <div>
                <Input name="name" label="Restaurant Name" />
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

export default AddEditRestaurant