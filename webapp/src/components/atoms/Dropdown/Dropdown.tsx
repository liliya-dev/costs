import { useEffect, useRef, useState } from 'react';

interface DropdownItem {
  id: number | string;
  label: string;
}

interface IProps {
  title?: string;
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  selectedItem: DropdownItem;
  disabled?: boolean;
}

const Dropdown = ({
  items,
  onSelect,
  placeholder = 'Select an option',
  title,
  selectedItem,
  disabled = false,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={disabled ? 'opacity-50' : ''}>
      {title && (
        <p className="mb-3 block text-body-sm font-medium text-dark dark:text-white">{title}</p>
      )}
      <div className="relative inline-block w-full text-left" ref={dropdownRef}>
        <div>
          <button
            onClick={toggleDropdown}
            type="button"
            className="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            aria-haspopup="true"
            aria-expanded={isOpen}
            disabled={disabled}
          >
            {selectedItem ? selectedItem.label : placeholder}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {isOpen && !disabled && (
          <div className="absolute right-0 z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {items
                .filter((item) => item.id !== selectedItem?.id)
                .map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
