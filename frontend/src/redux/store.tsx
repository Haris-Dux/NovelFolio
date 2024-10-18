import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import authMiddleware from "./middlewares/authMiddleware";
const env_NODE_ENV:string = "development";
 const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
  devTools: env_NODE_ENV !== "production",
  
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;