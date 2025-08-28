import Header from '../components/Header/Header';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <div className="font-mono">{children}</div>
    </>
  );
};

export default MainLayout;
