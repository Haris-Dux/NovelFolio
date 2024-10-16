
import { Request, Response, NextFunction  } from "express";

 interface CustomError extends Error {
  status?: number;
  authorizationError?: boolean;
  authHeaders?: { [key: string]: string };
  cause?: any;
  feedback?: string;
}

function LostErrorHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404);

  res.json({
    error: "Resource not found",
  });
}

// Exception Handler
function AppErrorHandler(err:CustomError, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);

  if (err.authorizationError === true) {
    res.set(err.authHeaders);
  }
  const error = err?.cause || err?.message;
  const providedFeedback = err?.feedback;

  res.json({ error, ...(providedFeedback && { feedback: providedFeedback }) });
}

export { LostErrorHandler, AppErrorHandler };
