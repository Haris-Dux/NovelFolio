import { storageChangeEvent } from "./customEvent";
const storage = sessionStorage; // The storage to use

const AuthTknName = "u:Id";
const IsAuthenticatedName = "isAuthenticated";

interface AuthStorage {
  isAuthenticated: boolean;
  set authTkn(token: string | any)
  logout(): void;
}

const authStorage : AuthStorage = {

   //Get Authentication Token(`access token`) of Authenticated user
  get authTkn() {
    try {
      let token = storage.getItem(AuthTknName);
      if (!token) return undefined as any;
      token = JSON.parse(token) || undefined;
      return token;
    } catch (error) {
      return undefined as any;
    }
  },

  
  //Store Authentication Token(`access token`) and set authentication status
  set authTkn(token: string | null) {
    // if (token) storage.setItem(AuthTknName, JSON.stringify(token));
    storage.setItem(IsAuthenticatedName, JSON.stringify(Boolean(token)));
    window.dispatchEvent(storageChangeEvent);
  },

 
  //Authentication status

  get isAuthenticated() {
    try {
      const isAuthenticated = JSON.parse(storage.getItem(IsAuthenticatedName) || "false");
      return Boolean(isAuthenticated);
    } catch (error) {
      return false;
    }
  },


  logout() {
    storage.removeItem(AuthTknName);
    storage.removeItem(IsAuthenticatedName);

    window.dispatchEvent(storageChangeEvent);
  },
};

export { authStorage };
