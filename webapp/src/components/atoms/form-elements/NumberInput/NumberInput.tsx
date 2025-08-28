import cx from 'classnames';
import { Field } from 'formik';

interface IProps {
  isTouched: boolean;
  isError: boolean;
  name: string;
  title: string;
  placeholder: string;
  errorText?: string;
  disabled?: boolean;
}

const NumberInput = ({
  isError,
  isTouched,
  name,
  title,
  placeholder,
  errorText,
  disabled = false,
}: IProps) => {
  return (
    <>
      <label
        className={cx('mb-1 block text-body-sm font-medium text-dark dark:text-white', {
          'opacity-50': disabled,
        })}
      >
        {title}
      </label>
      <Field
        id={name}
        name={name}
        type="number"
        disabled={disabled}
        placeholder={placeholder}
        className={cx(
          'focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 focus:outline-none',
          {
            'mb-1': isError,
            'mb-3': (!isError && !isTouched) || (isTouched && !isError),
            'cursor-not-allowed opacity-50': disabled,
          },
        )}
      />
      {isError && errorText && isTouched && (
        <p className="error-message mb-1 h-4 text-xs text-red-500">{errorText}</p>
      )}
    </>
  );
};

export default NumberInput;
