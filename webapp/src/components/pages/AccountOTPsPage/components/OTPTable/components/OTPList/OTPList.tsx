import IconButton from '@/components/atoms/IconButton/IconButton';
import TableRow from '@/components/atoms/table/TableRow/TableRow';
import Tag from '@/components/atoms/Tag/Tag';
import { currencySymbols } from '@/constants';
import { IOTP } from '@/types';
import { formatDate } from '@/utils/helpers/format-date.helper';

interface IProps {
  otps: IOTP[];
  handleOpenEditOTP: (otp: IOTP) => void;
  handleOpenDeleteOTP: (otp: IOTP) => void;
}

const OTPList = ({ otps, handleOpenDeleteOTP, handleOpenEditOTP }: IProps) => {
  return (
    <>
      {otps.map(({ amount, currency, datePaid, tags, name, description }, index) => (
        <div
          className={`grid grid-cols-3 sm:grid-cols-6 ${
            index === otps.length - 1 ? '' : 'border-b border-stroke dark:border-dark-3'
          }`}
          key={index}
        >
          <TableRow>
            <p className="font-medium">{name}</p>
          </TableRow>
          <TableRow>
            {amount} {currencySymbols[currency]}
          </TableRow>
          <TableRow>{formatDate(datePaid)}</TableRow>
          <TableRow>{description}</TableRow>
          <TableRow>
            {tags.map((item) => (
              <Tag key={item.id} label={item.name} color={item.color} />
            ))}
          </TableRow>
          <TableRow>
            <div className="flex w-full justify-end">
              <IconButton
                iconHeight={24}
                iconColor="LIGHT"
                icon="Edit"
                onClick={() => handleOpenEditOTP(otps[index])}
              />
              <div className="ml-4" />
              <IconButton
                iconHeight={24}
                iconColor="RED"
                icon="Trash"
                onClick={() => handleOpenDeleteOTP(otps[index])}
              />
            </div>
          </TableRow>
        </div>
      ))}
      {!otps.length && (
        <div className="bg-white px-6 py-12">
          <p className="text-center text-lg">There are no one time expenses yet</p>
        </div>
      )}
    </>
  );
};

export default OTPList;
