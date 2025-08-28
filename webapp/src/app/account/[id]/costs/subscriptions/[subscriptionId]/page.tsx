import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import SubscriptionPage from '@/components/pages/SubscriptionPage/SubscriptionPage';

const Page = ({ params }: { params: { id: number; subscriptionId: number } }) => {
  return (
    <DashBoardLayout>
      <SubscriptionPage accountId={params.id} subscriptionId={params.subscriptionId} />
    </DashBoardLayout>
  );
};

export default Page;
