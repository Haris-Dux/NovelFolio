import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../redux/actions";
import toast from "react-hot-toast";
import { AppDispatch } from "../redux/store";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const loginLoading = useSelector(({ auth }) => auth.user_loading);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email address is invalid")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, actions) => {
      // alert(JSON.stringify(values, null, 2));
      function alterFormToAPIResult(error: string | null) {
        if (error) {
          actions.setFieldTouched("password", false);
          actions.setFieldValue("password", "");
          toast.error(error);
        }
      }
      dispatch(login(values, alterFormToAPIResult));
    },
  });

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center ">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Please Login</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
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
              tabIndex={1}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-xs italic mb-3">
                {formik.errors.email}
              </p>
            ) : null}
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Password"
                tabIndex={2}
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-xs italic mb-3">
                {formik.errors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
            disabled={loginLoading}
            tabIndex={3}
          >
            {loginLoading ? "Loading..." : "Submit"}
          </button>

          
        </form>
        <p className="align-baseline font-medium mt-4 text-sm">
            Haven't an account? Please{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              Register
            </Link>
          </p>
        <p className='mt-5 text-center text-gray-500 text-xs'>©2025 Book Store. All rights reserved.</p>

      </div>
    </div>
  );
}

export default Login;
