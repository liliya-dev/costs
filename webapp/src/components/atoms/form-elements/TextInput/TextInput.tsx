import cx from 'classnames';
import { Field } from 'formik';

interface IProps {
  isTouched: boolean;
  isError: boolean;
  name: string;
  title: string;
  placeholder: string;
  errorText?: string;
}

const TextInput = ({ isError, isTouched, name, title, placeholder, errorText }: IProps) => {
  return (
    <>
      <label className="mb-1 block text-body-sm font-medium text-dark dark:text-white">
        {title}
      </label>
      <Field
        id={name}
        name={name}
        placeholder={placeholder}
        className={cx(
          'dd focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 focus:outline-none',
          {
            'mb-1': isError,
            'mb-3': (!isError && !isTouched) || (isTouched && !isError),
          },
        )}
      />
      {isError && errorText && isTouched && (
        <p className="error-message mb-1 h-4 text-xs text-red-500">{errorText}</p>
      )}
    </>
  );
};

export default TextInput;
