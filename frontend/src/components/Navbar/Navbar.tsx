import { Link } from "react-router-dom";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logout, updateUserProfile } from "../../redux/actions";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { BiX } from "react-icons/bi";
import { MdOutlineNoteAdd } from "react-icons/md";
import ReviewModal from "../ReviewModal/ReviewModal";
import { AuthenticationContext } from "../../context/authenticationContext";
import { getALLReviews } from "../../redux/actions/review";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state?.auth?.user);
  const { userIsAuthenticated } = useContext(AuthenticationContext);
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

   useEffect(() => {
    if (searchQuery) {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      const newTimeout = setTimeout(() => {
        dispatch(getALLReviews({search:searchQuery}))
      }, 1000);

      setDebounceTimeout(newTimeout);
    }
  }, [searchQuery, dispatch]); 

  const update_loading = useSelector(
    (state: RootState) => state?.auth?.update_loading
  );

  const handleLogOut = () => {
    dispatch(logout());
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openReviewModal = () => {
    setReviewModal(true);
  };

  const closeReviewModal = () => {
    setReviewModal(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      const updatedValues = Object.keys(values).reduce(
        (acc: Partial<typeof values>, key: string) => {
          const typedKey = key as keyof typeof values;

          if (values[typedKey] !== formik.initialValues[typedKey]) {
            acc[typedKey] = values[typedKey];
          }

          return acc;
        },
        {}
      );

      function alterFormToAPIResult(
        error: string | null,
        success: string | null
      ) {
        if (error) {
          toast.error(error);
        } else if (success) {
          toast.success(success);
        }
      }
      dispatch(updateUserProfile(updatedValues, alterFormToAPIResult));
    },
  });

  return (
    <header className="max-w-screen-2xl mx-auto px-4 py-4">
      <nav className="flex justify-between items-center">
        {/* left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiMiniBars3CenterLeft className="size-6" />
          </Link>

          {/* search input */}
          {!userIsAuthenticated && (
            <div className="relative sm:w-72 w-40 space-x-2">
              <IoSearchOutline className="absolute inline-block left-3 inset-y-2" />

              <input
                type="text"
                placeholder="Search here"
                className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>
          )}
        </div>

        {/* rigth side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
         {userIsAuthenticated && <MdOutlineNoteAdd
            onClick={openReviewModal}
            className="size-6 cursor-pointer"
          />}

          <div>
            <div className="relative group">
              <Link to="/login">
                {" "}
                <HiOutlineUser className="size-6" />
               {userIsAuthenticated && <div className="absolute bg-white right-0 hidden group-hover:block">
                  <div className="container block mx-auto mt-4 max-w-md p-4 border rounded-lg shadow-lg">
                    <h2 className="text-center text-2xl font-semibold mb-4">
                      Your Profile
                    </h2>

                    {/* Card Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <div className="mb-4">
                        <h3 className="font-semibold">Details of user:</h3>
                        <ul className="mt-2 space-y-2">
                          <li>
                            <b>First Name: </b>
                            <span>{user?.firstName}</span>
                          </li>
                          <li>
                            <b>Last Name: </b>
                            <span>{user?.lastName}</span>
                          </li>
                          <li>
                            <b>Email: </b>
                            <span>{user?.email}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="flex bg-white items-center justify-center gap-2">
                      <button
                        onClick={handleLogOut}
                        className="mt-4 block text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                      >
                        log Out
                      </button>
                      <button
                        onClick={openModal}
                        className="mt-4 block text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                      >
                        Edit User
                      </button>
                    </div>
                  </div>
                </div>}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Update user modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center ">
          <div className="relative w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2">
            <BiX
              size={32}
              onClick={closeModal}
              className="text-red-500 absolute right-1 top-1 cursor-pointer"
            />
            <form onSubmit={formik.handleSubmit}>
              {/* First Name */}
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter first name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <span className="text-red-500 text-xs italic mb-2">
                    {formik.errors.firstName}
                  </span>
                ) : null}
              </div>

              {/* Last Name */}
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter last name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <span className="text-red-500 text-xs italic mb-2">
                    {formik.errors.lastName}
                  </span>
                ) : null}
              </div>

              {/* Email Address */}
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                />
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-red-500 text-xs italic mb-2">
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:hover:bg-none hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
                disabled={!formik.dirty || update_loading}
              >
                {update_loading ? "Loading..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* create review modal */}
      {reviewModal && <ReviewModal closeReviewModal={closeReviewModal} />}
    </header>
  );
};

export default Navbar;
