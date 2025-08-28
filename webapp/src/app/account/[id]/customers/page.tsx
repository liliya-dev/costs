import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountCustomersPage from '@/components/pages/AccountCustomersPage/AccountCustomersPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountCustomersPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
