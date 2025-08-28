'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

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

  const isActive = cleanPath === item.route || cleanPath.startsWith(item.route + '/');
  const hasActiveChild = item.children?.some(
    (child) => cleanPath === child.route || cleanPath.startsWith(child.route + '/'),
  );

  const isAnyActive = isActive || hasActiveChild;

  return (
    <li>
      <Link
        href={item.route}
        className={`${
          isAnyActive
            ? 'bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white'
            : 'text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white'
        } group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
      >
        {item.icon}
        {item.label}
      </Link>

      {item.children && (
        <ul className="ml-6 mt-1 flex flex-col gap-2 border-l border-gray-200 pl-4 dark:border-gray-700">
          {item.children.map((child) => {
            const isChildActive =
              cleanPath === child.route || cleanPath.startsWith(child.route + '/');

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
