import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import CustomerPage from '@/components/pages/CustomerPage/CustomerPage';

const Page = ({ params }: { params: { id: number; customerId: number } }) => {
  return (
    <DashBoardLayout>
      <CustomerPage customerId={params.customerId} />
    </DashBoardLayout>
  );
};

export default Page;
