import { useField } from 'formik';

interface IProps {
  name: string;
  label?: string;
}

const Checkbox = ({ name, label = 'Default checkbox' }: IProps) => {
  const [field, , helpers] = useField({ name, type: 'checkbox' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(e.target.checked); // set boolean value
  };

  return (
    <div className="mb-4 mt-8 flex items-center">
      <input
        id={name}
        type="checkbox"
        checked={field.value}
        onChange={handleChange}
        className="h-4 w-4 cursor-pointer rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:outline-none focus:ring-0 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      />
      <label htmlFor={name} className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
