
class CustomError extends Error {
  status?:Number;
  message: any ;
  feedback?: string;
  cause?:any
  constructor(message: any, statusCode: Number, feedback = "") {
    super(message);
    this.name = "CustomError";
    this.status = statusCode;
    this.cause = message;
    this.feedback = feedback;
  }
}

export default CustomError;
