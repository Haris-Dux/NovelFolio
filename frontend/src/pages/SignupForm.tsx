import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { signup } from "../redux/actions";
import { AppDispatch, RootState } from "../redux/store";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const signupLoading = useSelector(
    (state: RootState) => state.auth.user_loading
  );

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(4, "Must be 4 characters or more")
        .required("Password is required"),
      passwordConfirm: Yup.string()
        .required("Confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: (values, actions) => {
      // alert(JSON.stringify(values, null, 2));
      function alterFormToAPIResult(error: string | null) {
        if (error) {
          actions.setFieldTouched("password", false);
          actions.setFieldValue("password", "");

          actions.setFieldTouched("passwordConfirm", false);
          actions.setFieldValue("passwordConfirm", "");
          toast.error(error);
        }
      }
      dispatch(signup(values, alterFormToAPIResult));
    },
  });

  return (
    <div className="flex justify-center items-center ">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2">
        <h2 className="text-xl font-semibold mb-2">Please Register</h2>

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

          {/* Password */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {formik.touched.password && formik.errors.password ? (
              <span className="text-red-500 text-xs italic mb-2">
                {formik.errors.password}
              </span>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Confirm Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
              <span className="text-red-500 text-xs italic mb-2">
                {formik.errors.passwordConfirm}
              </span>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
            disabled={signupLoading}
          >
            {signupLoading ? "Loading..." : "Submit"}
          </button>
        </form>
        <p className='align-baseline font-medium mt-2 text-sm'>Have an account? Please <Link to="/login" className='text-blue-500 hover:text-blue-700'>Login</Link></p>
        <p className='mt-2 text-center text-gray-500 text-xs'>©2025 Book Store. All rights reserved.</p>

      </div>
    </div>
  );
}

export default Signup;
