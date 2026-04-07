type SortDirection = 'asc' | 'desc' | null;

interface IProps {
  title: string;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onClick?: () => void;
}

const TableHeader = ({ title, sortable = false, sortDirection = null, onClick }: IProps) => {
  return (
    <div
      className={`px-3 pb-3.5 ${sortable ? 'cursor-pointer select-none' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-1 text-base font-medium">
        <p>{title}</p>
        {sortable && (
          <span className="inline-flex flex-col text-[7px] leading-[1] text-gray-400">
            <span className={sortDirection === 'asc' ? 'text-dark dark:text-white' : ''}>▲</span>
            <span className={sortDirection === 'desc' ? 'text-dark dark:text-white' : ''}>▼</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
