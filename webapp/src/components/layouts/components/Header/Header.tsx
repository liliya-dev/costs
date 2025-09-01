import Image from 'next/image';
import Link from 'next/link';

import arrowRightIcon from '@/icons/app-logo.svg';

const Header = () => {
  return (
    <div className="sticky top-0 z-50 px-16 py-4 bg-white border-b shadow-sm">
      <Link href="/" className="flex items-center">
        <Image src={arrowRightIcon} width={50} height={40} alt="Picture of the author" />
        <p className="mt-2 ml-4 text-black">Costs Manager</p>
      </Link>
    </div>
  );
};

export default Header;
