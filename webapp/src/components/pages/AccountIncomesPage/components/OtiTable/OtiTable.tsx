import { useCallback, useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import Loader from '@/components/atoms/Loader/Loader';
import TableHeader from '@/components/atoms/table/TableHeader/TableHeader';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import TableTitle from '@/components/atoms/table/TableTitle/TableTitle';
import { currencySymbols } from '@/constants';
import { IOTI, Currency } from '@/types';
import { convertAmountToCurrency } from '@/utils/helpers/convert-amount-to-currency.helper';
import { formatDate } from '@/utils/helpers/format-date.helper';

import DeleteOTITransaction from './components/modals/DeleteOTITransaction/DeleteOTITransaction';
import EditOTITransaction from './components/modals/EditOTITransaction/EditOTITransaction';

interface IProps {
  otis: IOTI[];
  isLoading: boolean;
  selectedCurrency: Currency;
  handleDataReload: () => void;
}

const headers = ['Name', 'Amount', 'UAH-USD', 'UAH_EUR', 'Date paid', 'Description'];

const OtiTable = ({ otis, isLoading, selectedCurrency, handleDataReload }: IProps) => {
  const [editedOti, setEditedOti] = useState<IOTI | null>(null);
  const [deletedOti, setDeletedOti] = useState<IOTI | null>(null);

  const handleOpenEditOTI = useCallback((oti: IOTI) => {
    setEditedOti(oti);
  }, []);

  const handleCloseEditOTI = useCallback(() => {
    setEditedOti(null);
  }, []);

  const handleOpenDeleteOTI = useCallback((oti: IOTI) => {
    setDeletedOti(oti);
  }, []);

  const handleCloseDeleteOTI = useCallback(() => {
    setDeletedOti(null);
  }, []);

  return (
    <>
      {deletedOti && (
        <DeleteOTITransaction
          oti={deletedOti}
          handleClose={handleCloseDeleteOTI}
          callback={handleDataReload}
        />
      )}
      {editedOti && (
        <EditOTITransaction
          oti={editedOti}
          handleClose={handleCloseEditOTI}
          callback={handleDataReload}
        />
      )}
      <div className="mt-12 rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-12 flex justify-between">
          <TableTitle title="One time income payments in the current period" />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 sm:grid-cols-7">
            {headers.map((item) => (
              <TableHeader
                key={item}
                title={item !== 'Amount' ? item : `${item} (${currencySymbols[selectedCurrency]})`}
              />
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {otis.map(
                (
                  { name, amount, currency, rateUahToEur, rateUahToUsd, datePaid, description, id },
                  index,
                ) => (
                  <div
                    className={`grid grid-cols-3 sm:grid-cols-7 ${
                      index === otis.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
                    }`}
                    key={id}
                  >
                    <TableRow>
                      {name}({amount}
                      {currencySymbols[currency]})
                    </TableRow>

                    <TableRow>
                      {convertAmountToCurrency({
                        amount,
                        selectedCurrency,
                        rateUahToEur,
                        rateUahToUsd,
                        currency,
                      })}
                    </TableRow>
                    <TableRow>{rateUahToUsd}</TableRow>
                    <TableRow>{rateUahToEur}</TableRow>
                    <TableRow>{formatDate(datePaid)}</TableRow>
                    <TableRow>{description}</TableRow>
                    <TableRow>
                      <div className="flex w-full justify-end">
                        <IconButton
                          iconHeight={24}
                          iconColor="LIGHT"
                          icon="Edit"
                          onClick={() => handleOpenEditOTI(otis[index])}
                        />
                        <div className="ml-4" />
                        <IconButton
                          iconHeight={24}
                          iconColor="RED"
                          icon="Trash"
                          onClick={() => handleOpenDeleteOTI(otis[index])}
                        />
                      </div>
                    </TableRow>
                  </div>
                ),
              )}
              {!otis.length && (
                <div className="bg-white px-6 py-12">
                  <p className="text-center text-lg">
                    There are no one time income payments in this period
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OtiTable;
