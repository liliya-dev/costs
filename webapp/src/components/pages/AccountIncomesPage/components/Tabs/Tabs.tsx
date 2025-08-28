import { useState } from 'react';

interface IItem {
  id: string;
  title: string;
  component: React.ReactNode;
}
interface IProps {
  items: IItem[];
}

const Tabs = ({ items }: IProps) => {
  const [activeItem, setActiveItem] = useState(items[0]);
  return (
    <div className="h-full w-full rounded-[10px] bg-white px-7.5 pb-4 pt-5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-6">
      <div className="flex">
        {items.map((item) => (
          <button
            onClick={() => setActiveItem(item)}
            key={item.id}
            style={{ borderBottom: item.id === activeItem.id ? '2px solid grey' : 'none' }}
            className="mb-4 pb-2 pl-2 pr-6 text-lg font-semibold text-dark dark:text-white"
          >
            {item.title}
          </button>
        ))}
      </div>
      {activeItem.component}
    </div>
  );
};

export default Tabs;
