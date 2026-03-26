import Link from 'next/link';
import { useState } from 'react';

import IconButton from '@/components/atoms/IconButton/IconButton';
import Text from '@/components/atoms/Text/Text';
import FullScreenModal from '@/components/molecules/FullScreenModal/FullScreenModal';
import { IAccount } from '@/types';
import { deleteAccount } from '@/utils/api';

interface IProps {
  account: IAccount;
  callback: () => void;
}

const AccountItem = ({ account, callback }: IProps) => {
  const [isDeleteApprovalModal, setIsDeleteApprovalModal] = useState(false);

  const hanleDelete = async () => {
    await deleteAccount(account.id);
    setIsDeleteApprovalModal(false);
    callback();
  };

  const toggleApproveModal = () => setIsDeleteApprovalModal(!isDeleteApprovalModal);

  return (
    <>
      {isDeleteApprovalModal && (
        <FullScreenModal
          onClose={toggleApproveModal}
          onSecondaryButtonClick={toggleApproveModal}
          onPrimaryButtonClick={hanleDelete}
          primaryButtonText="Yes"
          secondaryButtonText="Cancel"
          title="Delete account"
        >
          <Text
            color={'DARK'}
            text={`Are you sure you want to delete account ${account.name}?`}
            size={'S'}
          />
        </FullScreenModal>
      )}
      <div className="relative mb-4 flex items-center justify-between rounded-md bg-white px-5 py-3 transition-opacity duration-200 hover:opacity-80">
        <Link href={`account/${account.id}/incomes`} className="flex w-3/5">
          <Text text={account.name} color="DARK" size="L" />
        </Link>
        <div className="flex items-center">
          <IconButton iconHeight={24} iconColor="RED" icon="Trash" onClick={toggleApproveModal} />
        </div>
      </div>
    </>
  );
};

export default AccountItem;
