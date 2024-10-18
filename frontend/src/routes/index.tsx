import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/LoginForm";
import Signup from "../pages/SignupForm";
import Lost from "../pages/Lost";
import AppLayout from "../pages/AppLayout";
import Home from "../components/home/Home";
import Profile from "../components/Profile/Profile";
import PublicRouteGuard from "../components/Guards/PublicGuard";
import PrivateRouteGuard from "../components/Guards/PrivateGuard";


const router = createBrowserRouter([
  {
    path: "",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <PublicRouteGuard />,
        children: [
          { path: "", element: <Home /> },
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
        
        ],
      },
      {
        path: "/profile",
        element: <PrivateRouteGuard />,
        children: [
          { path: "", element: <Profile /> },
        ],
      },
      { path: "404", element: <Lost /> },
      {
        path: "*",
        element: <Navigate to="/404" />,
      },
    ],
  },
]);

export { router };
