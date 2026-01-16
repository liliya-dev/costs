'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  route: string;
  children?: MenuItem[];
}

interface IProps {
  item: MenuItem;
}

const SidebarItem = ({ item }: IProps) => {
  const pathname = usePathname();
  const cleanPath = pathname.split('?')[0];
  const [expanded, setExpanded] = useState(false);
  const isActive = cleanPath === item.route;
  const hasActiveChild = item.children?.some((child) => cleanPath === child.route);

  useEffect(() => {
    if (isActive || hasActiveChild) setExpanded(true);
  }, [isActive, hasActiveChild]);

  const toggleExpand = () => {
    if (item.children) setExpanded((prev) => !prev);
  };

  return (
    <li>
      <div
        className={`${
          isActive
            ? 'bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white'
            : 'text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white'
        } group relative flex cursor-pointer items-center justify-between gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          <Link href={item.route}>{item.label}</Link>
        </div>

        {item.children && (
          <span
            className={`text-sm opacity-60 transition-transform duration-200 ${
              expanded ? 'rotate-90' : 'rotate-0'
            }`}
          >
            ▶
          </span>
        )}
      </div>

      {item.children && expanded && (
        <ul className="ml-6 mt-1 flex flex-col gap-2 border-l border-gray-200 pl-4 dark:border-gray-700">
          {item.children.map((child) => {
            const isChildActive = cleanPath === child.route;

            return (
              <li key={child.route}>
                <Link
                  href={child.route}
                  className={`${
                    isChildActive
                      ? 'font-semibold text-primary dark:text-white'
                      : 'text-dark-4 hover:text-dark dark:text-gray-5 dark:hover:text-white'
                  } block py-1 text-sm transition`}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
