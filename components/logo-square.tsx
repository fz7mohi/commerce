import clsx from 'clsx';
import LogoIcon from './icons/logo';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <LogoIcon
      className={clsx({
        'h-[40px] w-[40px]': !size, // Increased from 16px to 40px
        'h-[28px] w-[28px]': size === 'sm' // Increased from 10px to 28px
      })}
    />
  );
}
