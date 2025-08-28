import Image from 'next/image';
import Link from 'next/link';

import arrowRightIcon from '@/icons/app-logo.svg';

const Header = () => {
  return (
    <div className="sticky top-0 z-50 bg-slate-400 px-16 py-4">
      <Link href="/" className="flex items-center">
        <Image src={arrowRightIcon} width={50} height={50} alt="Picture of the author" />
        <p className="mt-2 font-bold">Costs manager</p>
      </Link>
    </div>
  );
};

export default Header;
