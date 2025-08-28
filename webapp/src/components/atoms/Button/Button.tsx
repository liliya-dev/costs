import cx from 'classnames';

import { ButtonType } from './Button.options';

interface IProps {
  title: string;
  type: ButtonType;
  onClick: () => void;
  isDisabled?: boolean;
  buttonType?: 'submit' | 'reset' | 'button';
}

const typeClasses: Record<ButtonType, string> = {
  DARK: 'bg-dark text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10',
  LIGHT: 'border border-dark text-dark rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10',
  DANGER: 'bg-red text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10',
  SUCESS: 'bg-primary text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"',
};

const Button = ({ title, type, onClick, isDisabled = false, buttonType = 'button' }: IProps) => {
  return (
    <button
      type={buttonType}
      disabled={isDisabled}
      onClick={onClick}
      className={cx(
        typeClasses[type],
        'inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 disabled:opacity-70',
      )}
    >
      {title}
    </button>
  );
};

export default Button;
