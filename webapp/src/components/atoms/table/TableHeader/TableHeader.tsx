interface IProps {
  title: string;
}
const TableHeader = ({ title }: IProps) => {
  return (
    <div className="px-2 pb-3.5">
      <h5 className="text-md font-medium uppercase xsm:text-base">{title}</h5>
    </div>
  );
};

export default TableHeader;
