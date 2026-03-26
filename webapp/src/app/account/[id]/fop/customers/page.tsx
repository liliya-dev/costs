import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import FopCustomersPage from '@/components/pages/FopCustomersPage/FopCustomersPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <FopCustomersPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
