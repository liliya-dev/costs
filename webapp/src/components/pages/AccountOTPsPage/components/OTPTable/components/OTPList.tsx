import { IOTP, ITag } from '@/types';

import EmptyOTPs from './EmptyOTPs';
import OTPRow from './OTPRow';

interface IProps {
  otps: IOTP[];
  handleOpenEditOTP: (otp: IOTP) => void;
  handleOpenDeleteOTP: (otp: IOTP) => void;
  onTagClick: (tag: ITag) => void;
}

const OTPList = ({ otps, handleOpenEditOTP, handleOpenDeleteOTP, onTagClick }: IProps) => {
  if (!otps.length) return <EmptyOTPs />;

  return (
    <>
      {otps.map((otp, index) => (
        <OTPRow
          key={otp.id}
          otp={otp}
          index={index}
          total={otps.length}
          onEdit={handleOpenEditOTP}
          onDelete={handleOpenDeleteOTP}
          onTagClick={onTagClick}
        />
      ))}
    </>
  );
};

export default OTPList;
