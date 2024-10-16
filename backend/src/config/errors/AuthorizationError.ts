import CustomError from "./CustomError";

class AuthorizationError extends CustomError {
message: any;
authParams?:{ [key: string]: any } 
authHeaders?: { [key: string]: string } 
authorizationError: boolean; 
   
  constructor(message:any, statusCode:Number , feedback:string, authParams:{ [key: string]: any } ) {
    super(message, statusCode || 401, feedback); 
    this.authorizationError = true;
    this.authParams = authParams;
    this.authHeaders = {
      "WWW-Authenticate": `Bearer ${this.#stringifyAuthParams()}`,
    };
  }

  // Private Method to convert object `key: value` to string `key=value`
  #stringifyAuthParams() {
    let str = "";

    let { realm, ...others } = this.authParams || {};

    realm = realm || "Access to user account";

    str = `realm=${realm}`;

    const otherParams = Object.keys(others);
    if (otherParams.length < 1) return str;

    otherParams.forEach((authParam, index, array) => {
      // Delete other `realm(s)` if exists
      if (authParam.toLowerCase() === "realm") {
        delete others[authParam];
      }

      let comma = ",";
      // If is last Item then no comma
      if (array.length - 1 === index) comma = "";
        str = str + ` ${authParam}=${this.authParams![authParam]}${comma}`;

    });

    return str;
  }
}

export default AuthorizationError;
