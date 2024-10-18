import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import useLocalStorage from "../hooks/useLocalStorage";
import Navbar from "../components/Navbar/Navbar";
import { AuthenticationContext } from "../context/authenticationContext";

function AppLayout() {
  const hasToken = useSelector((state) => state?.auth?.token);
  const authStorage = useLocalStorage((storage) => storage.authStorage);

  const cachedUserIsAuthenticated = useMemo(() => {
    const userIsAuthenticated =
      Boolean(hasToken) || authStorage?.isAuthenticated;
    return userIsAuthenticated;
  }, [hasToken, authStorage?.isAuthenticated]);

 
  return (
    <AuthenticationContext.Provider
      value={{ userIsAuthenticated: cachedUserIsAuthenticated
      }}
    >
      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
        <Navbar />
        <Outlet />
      </main>
    </AuthenticationContext.Provider>
  );
}

export default AppLayout;
