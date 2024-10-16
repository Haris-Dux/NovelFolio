
class CustomError extends Error {
  status?:Number;
  message: any ;
  cause?:any
  constructor(message: any, statusCode: Number) {
    super(message);
    this.name = "CustomError";
    this.status = statusCode;
    this.cause = message;
  }
}

export default CustomError;
