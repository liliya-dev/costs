import { useState } from 'react';

import { IconType, IconTypeKeys } from '@/icons/svg/icons';

import { COLORS, ColorType } from '../Text/Text.options';

interface IProps {
  iconWidth?: number;
  iconHeight?: number;
  icon: IconTypeKeys;
  onClick: () => void;
  iconColor?: ColorType;
  hoverColor?: ColorType;
}

const IconButton = ({
  icon,
  iconHeight = 32,
  iconWidth = 32,
  iconColor = 'LIGHT',
  hoverColor = 'DARK',
  onClick,
}: IProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = IconType[icon];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconComponent
        width={iconWidth}
        height={iconHeight}
        color={isHovered ? COLORS[hoverColor] : COLORS[iconColor]}
      />
    </button>
  );
};

export default IconButton;
