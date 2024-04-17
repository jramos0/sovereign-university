import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { useMemo } from 'react';
import '../../styles/global.css';

import { cn } from '../../lib/utils.ts';
import type { BaseAtomProps } from '../types.ts';

export interface ButtonProps
  extends BaseAtomProps,
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > {
  children?: string | JSX.Element | JSX.Element[];
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  variant?:
    | 'primary'
    | 'newPrimary'
    | 'newPrimaryGhost'
    | 'secondary'
    | 'newSecondary'
    | 'tertiary'
    | 'download'
    | 'text';
  rounded?: boolean;
  glowing?: boolean;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  icon?: JSX.Element;
}

const classesBySize = {
  xs: 'px-2 py-1 text-xs/5',
  s: 'px-3 py-1.5 text-sm !font-medium',
  m: 'px-4 py-1 text-xs md:px-5 md:py-2 md:text-base !font-medium',
  l: 'px-8 py-2.5 text-lg !font-medium',
  xl: 'px-12 py-3 text-xl !font-medium',
};

const classesByVariant = {
  primary:
    'text-white bg-blue-700 hover:bg-blue-600 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
  newPrimary: 'bg-newOrange-1 text-white font-normal',
  newPrimaryGhost:
    'bg-transparent text-darkOrange-5 border border-darkOrange-4',
  tertiary: 'bg-orange-600 text-white font-normal',
  secondary: 'bg-white text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300',
  newSecondary: 'bg-white text-newBlack-2',
  download: 'bg-green-600 text-white font-normal',
  text: '',
};

export const Button = ({
  children,
  size,
  variant,
  rounded,
  glowing,
  iconLeft,
  iconRight,
  icon,
  className,
  disabled,
  ...buttonProps
}: ButtonProps) => {
  const classes = useMemo(
    () => [
      classesBySize[size ?? 'm'],
      classesByVariant[variant ?? 'primary'],
      rounded ? 'rounded-full' : 'rounded-lg',
    ],
    [rounded, size, variant],
  );

  const disabledClass = disabled
    ? ' active:none bg-newBlack-3 !text-newGray-1 font-normal cursor-default'
    : '';

  if (icon)
    return (
      <button
        disabled={disabled}
        className={cn(
          ...classes,
          disabled ? 'active:none' : 'active:scale-95',
          'flex flex-row items-center font-normal leading-normal transition-colors duration-150',
          className ?? '',
          disabledClass,
        )}
        {...buttonProps}
      >
        {icon}
      </button>
    );

  return (
    <button
      disabled={disabled}
      className={cn(
        ...classes,
        disabled ? 'active:none' : 'active:scale-95',
        'flex flex-row items-center justify-center font-normal leading-normal transition-colors duration-150',
        glowing && variant !== 'secondary' ? 'shadow-md-button' : '',
        glowing && variant === 'secondary' ? '!shadow-md-button-white' : '',
        className ?? '',
        disabledClass,
      )}
      {...buttonProps}
    >
      {iconLeft && <span className="mr-3">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-3">{iconRight}</span>}
    </button>
  );
};
