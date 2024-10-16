import { createSlice } from "@reduxjs/toolkit";


interface User {
  id?: string; 
  firstName?: string;
  lastName?: string;  
  email?: string;
}


interface AuthState {
  user: User | null;
  token: string | null;
  user_loading: boolean; 
  token_loading: boolean; 
  update_loading: boolean
}

const initialState:AuthState = {
  user: null,
  token: null,
  user_loading: false, // `user` info is being processed [e.g Login]
  token_loading: false, // when `token` info is being processed [e.g refreshing auth]
  update_loading:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuthToken(state, action) {
      const { payload } = action;
      return {
        ...state,
        token: payload?.token,
      };
    },
    addAuthUser(state, action) {
      const { payload } = action;
      return {
        ...state,
        user: { ...state.user, ...payload.user },
      };
    },
    authUserLoading(state, action) {
      const { payload } = action;
      return {
        ...state,
        user_loading: Boolean(payload?.loading),
      };
    },
    updateUserLoading(state, action) {
      const { payload } = action;
      return {
        ...state,
        update_loading: Boolean(payload?.loading),
      };
    },
    authUserLogout() {
      return {
        ...initialState,
      };
    },
    authTokenLoading(state, action) {
      const { payload } = action;
      return {
        ...state,
        token_loading: Boolean(payload?.loading),
      };
    },
  },
});

// Export action creators as named exports
export const {
  addAuthToken,
  addAuthUser,
  authUserLoading,
  authTokenLoading,
  authUserLogout,
  updateUserLoading
} = authSlice.actions;

// Export reducer as default export
export default authSlice.reducer;
