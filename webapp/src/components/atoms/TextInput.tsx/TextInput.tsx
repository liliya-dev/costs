interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
  isTouched?: boolean;
  isError?: boolean;
}

const TextInput = ({
  name,
  label,
  placeholder = '',
  error,
  isTouched,
  isError,
  ...rest
}: IProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className={`w-full rounded border px-4 py-2 text-base transition ${
          isError && isTouched
            ? 'border-red-500 ring-1 ring-red-400'
            : 'border-gray-300 focus:ring-0'
        } dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
        {...rest}
      />
      {isError && isTouched && error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default TextInput;
