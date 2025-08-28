'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import { IconType } from '@/icons/svg/icons';

import ClickOutside from './ClickOutside';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: '',
    menuItems: [
      {
        icon: <IconType.Income />,
        label: 'Income payments',
        route: '/account/[id]/incomes',
      },
      {
        icon: <IconType.Income />,
        label: 'Costs',
        route: '/account/[id]/costs/analyze',
        children: [
          {
            label: 'Costs by period analyze',
            route: '/account/[id]/costs/analyze',
          },
          {
            label: 'Subscriptions',
            route: '/account/[id]/costs/subscriptions',
          },
          {
            label: 'Payments by installments',
            route: '/account/[id]/costs/installments',
          },
          {
            label: 'Regular costs',
            route: '/account/[id]/costs/regular',
          },
          {
            label: 'One time costs',
            route: '/account/[id]/costs/one-time',
          },
        ],
      },
      {
        icon: <IconType.Income />,
        label: 'Customers',
        route: '/account/[id]/customers',
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const accountIdMatch = pathname.match(/\/account\/(\d+)/);
  const accountId = accountIdMatch ? accountIdMatch[1] : '1'; // fallback ID

  const resolvedMenuGroups = menuGroups.map((group) => ({
    ...group,
    menuItems: group.menuItems.map((item) => ({
      ...item,
      route: item.route.replace('[id]', accountId),
      children: item.children?.map((child) => ({
        ...child,
        route: child.route.replace('[id]', accountId),
      })),
    })),
  }));

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 duration-300 ease-linear' : '-translate-x-full'
        }`}
      >
        <div className="no-scrollbar flex flex-col overflow-y-auto pt-12 duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {resolvedMenuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.name && (
                  <h3 className="mb-5 text-sm font-bold text-dark-4 dark:text-dark-6">
                    {group.name}
                  </h3>
                )}
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem key={menuIndex} item={menuItem} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
