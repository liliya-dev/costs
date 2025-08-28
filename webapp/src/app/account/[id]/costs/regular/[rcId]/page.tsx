import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import RCPage from '@/components/pages/RCPage/RCPage';

const Page = ({ params }: { params: { id: number; rcId: number } }) => {
  return (
    <DashBoardLayout>
      <RCPage accountId={params.id} rcId={params.rcId} />
    </DashBoardLayout>
  );
};

export default Page;
