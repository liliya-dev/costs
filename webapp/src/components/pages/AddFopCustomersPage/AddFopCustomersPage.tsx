'use client';

import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';

import AddFopCustomerForm from './components/AddFopCustomerForm/AddFopCustomerForm';

interface IProps {
  accountId: number;
}

const AddFopCustomersPage = ({ accountId }: IProps) => {
  return (
    <div className="mt-12 h-full w-full rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-6">
      <TableTitle title="Add new FOP customer" />
      <div className="mb-8" />
      <AddFopCustomerForm accountId={accountId} />
    </div>
  );
};

export default AddFopCustomersPage;
