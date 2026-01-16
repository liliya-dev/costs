import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import FopCustomerPage from '@/components/pages/FopCustomerPage/FopCustomerPage';

const Page = ({ params }: { params: { id: number; customerId: number } }) => {
  return (
    <DashBoardLayout>
      <FopCustomerPage customerId={params.customerId} />
    </DashBoardLayout>
  );
};

export default Page;
