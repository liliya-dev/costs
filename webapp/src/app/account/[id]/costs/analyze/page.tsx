import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountCostsPage from '@/components/pages/AccountCostsPage/AccountCostsPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountCostsPage id={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
