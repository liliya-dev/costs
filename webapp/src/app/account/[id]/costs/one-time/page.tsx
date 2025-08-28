import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountOTPsPage from '@/components/pages/AccountOTPsPage/AccountOTPsPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountOTPsPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
