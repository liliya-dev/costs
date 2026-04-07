import Link from 'next/link';

import IconButton from '@/components/atoms/IconButton/IconButton';
import { TableCell } from '@/components/molecules/DataTable/DataTable';
import { currencySymbols } from '@/constants';
import { IFOPCustomer } from '@/types';

interface IProps {
  accountId: number;
  customers: IFOPCustomer[];
  handleOpenEditCustomer: (customer: IFOPCustomer) => void;
  handleOpenDeleteCustomer: (customer: IFOPCustomer) => void;
}

const FopCustomersList = ({
  customers,
  handleOpenDeleteCustomer,
  handleOpenEditCustomer,
  accountId,
}: IProps) => {
  return (
    <>
      {customers.map(({ name, currency, monthlyPayment, approximatelyPaymentDay, id }, index) => (
        <div
          className={`grid grid-cols-3 sm:grid-cols-5 ${
            index === customers.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
          }`}
          key={id}
        >
          <Link href={`/account/${accountId}/fop/customers/${id}`} className="contents">
            <TableCell>{name}</TableCell>
            <TableCell>{monthlyPayment}</TableCell>
            <TableCell>{currencySymbols[currency]}</TableCell>
            <TableCell>{approximatelyPaymentDay}</TableCell>
          </Link>
          <TableCell>
            <div className="flex w-full justify-end">
              <div className="ml-4" />
              <IconButton
                iconHeight={24}
                iconColor="LIGHT"
                icon="Edit"
                onClick={() => handleOpenEditCustomer(customers[index])}
              />
              <div className="ml-4" />
              <IconButton
                iconHeight={24}
                iconColor="RED"
                icon="Trash"
                onClick={() => handleOpenDeleteCustomer(customers[index])}
              />
            </div>
          </TableCell>
        </div>
      ))}
    </>
  );
};

export default FopCustomersList;
