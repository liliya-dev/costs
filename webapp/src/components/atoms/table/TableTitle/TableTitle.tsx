interface IProps {
  title: string;
}
const TableTitle = ({ title }: IProps) => {
  return <h4 className="text-body-2xlg font-bold text-dark dark:text-white">{title}</h4>;
};

export default TableTitle;
