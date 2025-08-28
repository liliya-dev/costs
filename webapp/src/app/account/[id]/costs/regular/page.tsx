import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountRCsPage from '@/components/pages/AccountRCsPage/AccountRCsPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountRCsPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
