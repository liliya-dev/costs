interface IProps {
  color: string;
  text: string;
}
const LegendItem = ({ color, text }: IProps) => {
  return (
    <div className="mr-8 flex px-2 py-6">
      <div className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border bg-white">
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <p>{text}</p>
    </div>
  );
};

export default LegendItem;
