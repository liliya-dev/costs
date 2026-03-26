import IconButton from '@/components/atoms/IconButton/IconButton';
import Text from '@/components/atoms/Text/Text';
import { IAccount } from '@/types';

interface IProps {
  account: IAccount;
  handleOpenEditCustomer: () => void;
}
const AccountInfo = ({ account, handleOpenEditCustomer }: IProps) => {
  return (
    <>
      <div className="flex">
        <Text size="XL" color="DARK" text="FOP Account Details" />
        <div className="ml-4" />
        <IconButton
          iconHeight={24}
          iconColor="LIGHT"
          icon="Edit"
          onClick={handleOpenEditCustomer}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="Full Name" />
          <Text size="M" color="DARK" text={account.fopFullName ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="Director" />
          <Text size="M" color="DARK" text={account.directorName ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="IBAN" />
          <Text size="M" color="DARK" text={account.iban ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="Bank Name" />
          <Text size="M" color="DARK" text={account.bankName ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="IPN" />
          <Text size="M" color="DARK" text={account.ipn ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="Bank EDRPOU" />
          <Text size="M" color="DARK" text={account.bankEdrpou ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="MFO" />
          <Text size="M" color="DARK" text={account.mfo ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="Address" />
          <Text size="M" color="DARK" text={account.address ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="Tax System" />
          <Text size="M" color="DARK" text={account.taxSystem ?? '—'} />
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Text size="S" color="LIGHT" text="Phone" />
          <Text size="M" color="DARK" text={account.phone ?? '—'} />
        </div>
      </div>
    </>
  );
};

export default AccountInfo;
