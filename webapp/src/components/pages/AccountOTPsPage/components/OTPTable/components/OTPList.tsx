import { IOTP, ITag } from '@/types';

import EmptyOTPs from './EmptyOTPs';
import OTPRow from './OTPRow';

interface IProps {
  otps: IOTP[];
  selectedTags: ITag[];
  handleOpenEditOTP: (otp: IOTP) => void;
  handleOpenDeleteOTP: (otp: IOTP) => void;
  handleUpdateSelectedTags: (tag: ITag) => void;
}

const OTPList = ({
  otps,
  selectedTags,
  handleOpenEditOTP,
  handleOpenDeleteOTP,
  handleUpdateSelectedTags,
}: IProps) => {
  const filteredOTPs =
    selectedTags.length > 0
      ? otps.filter((otp) =>
          selectedTags.every((tag) => otp.tags.some((otpTag) => otpTag.id === tag.id)),
        )
      : otps;

  if (!filteredOTPs.length) return <EmptyOTPs />;

  return (
    <>
      {filteredOTPs.map((otp, index) => (
        <OTPRow
          key={otp.id}
          otp={otp}
          index={index}
          total={filteredOTPs.length}
          onEdit={handleOpenEditOTP}
          onDelete={handleOpenDeleteOTP}
          onTagClick={handleUpdateSelectedTags}
        />
      ))}
    </>
  );
};

export default OTPList;
