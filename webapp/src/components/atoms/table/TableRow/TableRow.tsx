interface IProps {
  children: React.ReactNode | string;
}
const TableRow = ({ children }: IProps) => {
  return (
    <div className="hidden w-full items-center px-2 py-4 sm:flex">
      <div className="w-full font-medium text-dark dark:text-white">{children}</div>
    </div>
  );
};

export default TableRow;
