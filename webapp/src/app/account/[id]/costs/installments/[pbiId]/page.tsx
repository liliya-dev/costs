import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import PBIPage from '@/components/pages/PBIPage/PBIPage';

const Page = ({ params }: { params: { id: number; pbiId: number } }) => {
  return (
    <DashBoardLayout>
      <PBIPage accountId={params.id} pbiId={params.pbiId} />
    </DashBoardLayout>
  );
};

export default Page;
