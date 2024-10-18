
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
      function alterFormToAPIResult(error:string | null) {
        if (error) {
          actions.setFieldTouched("password", false);
          actions.setFieldValue("password", "");
          toast.error(error)
        }
      }
      dispatch(login(values, alterFormToAPIResult));
    },
  });

  return (
    <div className="max-w-md mx-auto">
  <h2 className="uppercase mb-3">Login to your account.</h2>

  <form onSubmit={formik.handleSubmit}>
    <div className="mb-3">
      <label htmlFor="email" className="block mb-1">
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
        className="w-full p-2 border rounded"
      />
      {formik.touched.email && formik.errors.email ? (
        <p className="text-red-500 text-sm">{formik.errors.email}</p>
      ) : null}
    </div>

    <div className="mb-3">
      <label htmlFor="password" className="block mb-1">
        Password
      </label>
      <div className="relative">
        <Link
          to="/recoverpass"
          className="text-blue-500 text-sm absolute right-0 -translate-y-full"
          tabIndex={5}
        >
          Forgot password?
        </Link>
        <input
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Password"
          tabIndex={2}
          className="w-full p-2 border rounded"
        />
      </div>
      {formik.touched.password && formik.errors.password ? (
        <p className="text-red-500 text-sm">{formik.errors.password}</p>
      ) : null}
    </div>

    <button
      type="submit"
      className="bg-blue-500 text-white py-2 px-4 rounded uppercase w-full"
      disabled={loginLoading}
      tabIndex={3}
    >
      {loginLoading ? "Loading..." : "Submit"}
    </button>

    <p className="text-gray-500 italic mt-3">
      Don't have an account yet?{" "}
      <Link to="/signup" tabIndex={4} className="text-blue-500">
        Sign Up here
      </Link>
    </p>
  </form>
</div>

  );
}

export default Login;
