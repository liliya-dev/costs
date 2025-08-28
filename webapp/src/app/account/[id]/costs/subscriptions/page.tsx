import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountSubscriptionsPage from '@/components/pages/AccountSubscriptionsPage/AccountSubscriptionsPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountSubscriptionsPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
