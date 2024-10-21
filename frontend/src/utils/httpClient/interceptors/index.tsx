import http from "..";
import { addAuthToken } from "../../../redux/features/auth/authSlice";
import { refreshAccessToken } from "../../../api";
import {AxiosError, AxiosResponse } from "axios";



function runInterceptors(store:{ getState: () => any; dispatch: (action: any) => void }) {

// REQUEST INTERCEPTOR
  http.interceptors.request.use(
    (config:any) => {
      if (config.requireAuthHeader) {
        // Retrieve authentication token from redux store or localStorage
        const token = store?.getState()?.auth?.token;
        // Create an Authorization header and add the token
        config.headers.Authorization = `Bearer ${token}`;
        delete config.requireAuthHeader;
      }
      return config;
    },
    (error:AxiosError) => {
      return Promise.reject(error);
    }
  );

 
//RESPONSE INTERCEPTOR

  // We write the response interceptor inside a function
  // so that we may reference to it
  function attachResponseInterceptor() {
    const responseInterceptor = http.interceptors.response.use(
      (response:AxiosResponse) => {
        return response;
      },
      async (error) => {
        const config = error?.config;
        const responseError = error?.response;

        if (
          responseError?.status === 401 &&
          responseError?.headers?.get("www-authenticate")?.startsWith("Bearer ")
        ) {
          // Detach the response interceptor temporarily
          http.interceptors.response.eject(responseInterceptor);

          try {
            const MAX_RETRIES = 2;
            // Track no. of retries with custom prop on `config`
            config._retries = Math.abs(config._retries) || 0;

            // Check if number of retries is exceeded
            if (config._retries >= MAX_RETRIES)
              throw new Error(`Max retries(${config?._retries}) reached!`);

            // Call API endpoint to refresh Access token
            const { data }  = await refreshAccessToken();
            const newAccessToken = data?.accessToken;

            // Add/replace `Authorization` header to `config` of original request
            config.headers.Authorization = `Bearer ${newAccessToken}`;

            // Add the new token to redux store
            store?.dispatch(addAuthToken({ token: newAccessToken }));

            // Increment retry count and attach back interceptor
            config._retries++;
            attachResponseInterceptor();

            // Call the original request with the updated `config` and exit function
            return http({ ...config, headers: config.headers.toJSON() });
          } catch (reauthError) {
            attachResponseInterceptor();
           
          }
        }
        return Promise.reject(error);
      }
    );
  }
  attachResponseInterceptor();
}

const interceptors = { attach: runInterceptors };

export default interceptors;
