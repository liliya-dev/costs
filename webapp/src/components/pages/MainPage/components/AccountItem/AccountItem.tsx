import Link from 'next/link';
import { useState } from 'react';

import Button from '@/components/atoms/Button/Button';
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
      <div className="relative flex items-center justify-between">
        <Link
          href={`account/${account.id}/incomes`}
          className="mb-4 flex w-full items-center justify-between rounded-md bg-slate-200 px-8 py-5 hover:bg-sky-200 active:bg-sky-300"
        >
          <Text text={account.name} color="DARK" size="L" />
        </Link>
        <div className="absolute right-8 top-3 flex items-center">
          {/* <Button type="LIGHT" title="Edit" onClick={() => {}} />
          <div className="mx-2" /> */}
          <Button type="DANGER" title="Delete" onClick={toggleApproveModal} />
        </div>
      </div>
    </>
  );
};

export default AccountItem;
