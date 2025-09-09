import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AddFopCustomersPage from '@/components/pages/AddFopCustomersPage/AddFopCustomersPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AddFopCustomersPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
