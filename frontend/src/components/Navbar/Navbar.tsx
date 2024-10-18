import { Link } from "react-router-dom";
import { HiMiniBars3CenterLeft, HiOutlineHeart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";

const Navbar = () => {
  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-6">
      <nav className="flex justify-between items-center">
        {/* left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiMiniBars3CenterLeft className="size-6" />
          </Link>

          {/* search input */}
          <div className="relative sm:w-72 w-40 space-x-2">
            <IoSearchOutline className="absolute inline-block left-3 inset-y-2" />

            <input
              type="text"
              placeholder="Search here"
              className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* rigth side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          <div>
            <>
              {/* <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                <ul className="py-2">
                  <li>
                    <button
                      // onClick={handleLogOut}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>npm
                  </li>
                </ul>
              </div> */}
            </>

            {/* <Link to="/dashboard" className="border-b-2 border-primary">
                Dashboard
              </Link> */}

            <Link to="/login">
              {" "}
              <HiOutlineUser className="size-6" />
            </Link>
          </div>

          <button className="hidden sm:block">
            <HiOutlineHeart className="size-6" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
