interface IProps {
  children: React.ReactNode;
}

const TableCell = ({ children }: IProps) => {
  return (
    <div className="hidden w-full items-center px-3 py-4 sm:flex">
      <div className="w-full font-medium text-dark dark:text-white">{children}</div>
    </div>
  );
};

export default TableCell;
