import React, { useState } from 'react';
import { CiPlay1 } from "react-icons/ci";
import { MdOutlinePeople } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import shagunIcon from '../assets/shagunicon.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-orange-200 shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <img src={shagunIcon} alt="Shagun Icon" className="h-10 w-auto" />
        </div>

        <ul className="hidden md:flex gap-4 text-gray-700 font-medium">
          <li>
            <a href="/">
              <button className="bg-green-600 py-2 px-4 rounded-xl text-white flex items-center gap-2">
                <CiPlay1 size={20} />
                Try Demo
              </button>
            </a>
          </li>
          <li>
            <a href="/hostlogin">
              <button className="py-2 px-4 border border-gray-300 rounded-xl flex items-center gap-2">
                <MdOutlinePeople size={20} />
                Host Login
              </button>
            </a>
          </li>
          <li>
           <Link to="/admin">
            <button className="px-4 py-2 border border-gray-300 rounded-xl flex items-center gap-2">
              <FaRegChartBar size={20} />
              Dashboard
            </button>
          </Link>

          </li>
        </ul>

        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 px-4">
          <a href="/" className="block">
            <button className="w-full bg-green-600 py-2 px-4 rounded-md text-white flex items-center gap-2 justify-center">
              <CiPlay1 size={20} />
              Try Demo
            </button>
          </a>
          <a href="/courses" className="block">
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center gap-2 justify-center">
              <MdOutlinePeople size={20} />
              Host Login
            </button>
          </a>
          <Link to="/admin" className="block">
            <button className="w-full px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 justify-center">
              <FaRegChartBar size={20} />
              Dashboard
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
