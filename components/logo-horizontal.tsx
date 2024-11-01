import clsx from 'clsx';
import LogoIconhorizontal from './icons/logo-horizontal';

export default function LogoHorizontal({ size }: { size?: 'sm' | undefined }) {
  return (
    <LogoIconhorizontal
      className={clsx({
        'h-[36px] w-auto px-4': !size, // Height controlled, width auto with padding
        'h-[24px] w-auto px-3': size === 'sm' // Height controlled, width auto with padding
      })}
    />
  );
}
