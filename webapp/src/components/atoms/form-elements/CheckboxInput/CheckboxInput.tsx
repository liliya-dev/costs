import React from 'react';

interface IProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxInput = ({ name, label, checked, onChange }: IProps) => {
  return (
    <div className="my-5 flex items-center gap-2">
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
