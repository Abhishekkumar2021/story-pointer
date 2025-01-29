import React from 'react';
import { Link } from 'react-router';
import { RiNumbersFill } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import toast from 'react-hot-toast';

interface HeaderProps {
  sessionId: string;
}

const Header: React.FC<HeaderProps> = ({ sessionId }) => {

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);

    toast.success('Session ID copied to clipboard!');
  };

  return (
    <header className="bg-white w-full text-zinc-800 p-4 shadow-md">
      <nav className="w-full flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 hover:text-blue-800 transition-all">
          <RiNumbersFill className="text-3xl" />
          Story Pointer
        </Link>

        {/* Session Info */}
        {sessionId && (
          <div className="flex items-center border border-zinc-300 bg-white gap-3 p-3 rounded-lg">
            <p className="font-medium text-sm text-zinc-700 truncate">
              {sessionId}
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              <IoCopyOutline className="text-lg" />
              <span className="text-sm font-medium">Copy</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;