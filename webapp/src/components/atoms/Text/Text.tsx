import cx from 'classnames';

import { COLORS, ColorType, SizeType } from './Text.options';

interface IProps {
  color: ColorType;
  text: string;
  size: SizeType;
}

const sizeClasses: Record<SizeType, string> = {
  S: 'text-base font-light',
  M: 'text-lg font-light',
  L: 'text-xl font-semibold',
  XL: 'text-2xl font-bold',
  XXL: 'text-3xl font-bold',
};

const Text = ({ color, text, size }: IProps) => {
  return (
    <p
      className={cx(sizeClasses[size])}
      style={{
        color: COLORS[color],
      }}
    >
      {text}
    </p>
  );
};

export default Text;
