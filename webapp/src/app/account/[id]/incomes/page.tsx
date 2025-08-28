import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountIncomesPage from '@/components/pages/AccountIncomesPage/AccountIncomesPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountIncomesPage id={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
