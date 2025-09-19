import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountDetailsPage from '@/components/pages/AccountDetailsPage/AccountDetailsPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountDetailsPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
