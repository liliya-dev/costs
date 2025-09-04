import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountBalancePage from '@/components/pages/AccountBalancePage/AccountBalancePage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountBalancePage id={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
