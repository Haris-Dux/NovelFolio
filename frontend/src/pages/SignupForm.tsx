
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { signup } from "../redux/actions";
import { AppDispatch, RootState } from "../redux/store";
import toast from "react-hot-toast";

function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const signupLoading = useSelector((state:RootState) => state.auth.user_loading);

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
      function alterFormToAPIResult(error:string | null) {
        if (error) {
          actions.setFieldTouched("password", false);
          actions.setFieldValue("password", "");

          actions.setFieldTouched("passwordConfirm", false);
          actions.setFieldValue("passwordConfirm", "");
          toast.error(error)
        }
      }
      dispatch(signup(values, alterFormToAPIResult));
    },
  });

  return (
    <div className="max-w-md mx-auto">
  <h2 className="uppercase mb-3">Create account</h2>

  <form onSubmit={formik.handleSubmit}>
    {/* First Name */}
    <div className="mb-3">
      <label className="block font-medium mb-1">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter first name"
        className="w-full border border-gray-300 rounded-md p-2"
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <span className="text-red-500">{formik.errors.firstName}</span>
      ) : null}
    </div>

    {/* Last Name */}
    <div className="mb-3">
      <label className="block font-medium mb-1">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter last name"
        className="w-full border border-gray-300 rounded-md p-2"
      />
      {formik.touched.lastName && formik.errors.lastName ? (
        <span className="text-red-500">{formik.errors.lastName}</span>
      ) : null}
    </div>

    {/* Email Address */}
    <div className="mb-3">
      <label className="block font-medium mb-1">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter Email"
        className="w-full border border-gray-300 rounded-md p-2"
      />
      {formik.touched.email && formik.errors.email ? (
        <span className="text-red-500">{formik.errors.email}</span>
      ) : (
        <span className="text-gray-500">Your email will not be shared.</span>
      )}
    </div>

    {/* Password */}
    <div className="mb-3">
      <label className="block font-medium mb-1">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Enter Password"
        className="w-full border border-gray-300 rounded-md p-2"
      />
      {formik.touched.password && formik.errors.password ? (
        <span className="text-red-500">{formik.errors.password}</span>
      ) : null}
    </div>

    {/* Confirm Password */}
    <div className="mb-3">
      <label className="block font-medium mb-1">Confirm Password</label>
      <input
        id="passwordConfirm"
        name="passwordConfirm"
        type="password"
        value={formik.values.passwordConfirm}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Confirm Password"
        className="w-full border border-gray-300 rounded-md p-2"
      />
      {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
        <span className="text-red-500">{formik.errors.passwordConfirm}</span>
      ) : null}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="bg-blue-500 text-white uppercase rounded-md px-4 py-2 mt-3"
      disabled={signupLoading}
    >
      {signupLoading ? "Loading..." : "Submit"}
    </button>
  </form>
</div>

  );
}

export default Signup;
