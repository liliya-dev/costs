import DashBoardLayout from '@/components/layouts/DashboardLayout/DashBoardLayout';
import AccountPBIsPage from '@/components/pages/AccountPBIsPage/AccountPBIsPage';

const Page = ({ params }: { params: { id: number } }) => {
  return (
    <DashBoardLayout>
      <AccountPBIsPage accountId={params.id} />
    </DashBoardLayout>
  );
};

export default Page;
