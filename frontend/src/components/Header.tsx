import React from 'react';
import { Link } from 'react-router';
import { RiNumbersFill } from "react-icons/ri";


const Header: React.FC = () => (
  <header className='bg-white w-full text-zinc-800 p-4 shadow-md'>
    <nav>
      <Link to="/" className="flex items-center gap-2 font-bold text-2xl"> <RiNumbersFill />Story Pointer</Link>
    </nav>
  </header>
);

export default Header;
