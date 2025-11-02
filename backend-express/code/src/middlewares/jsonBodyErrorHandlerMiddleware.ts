import { NextFunction, Request, Response } from 'express';
import { errorInvalidParameters } from '../core/exceptions';

const jsonBodyErrorHandlerMiddleware = (
  error: Record<string, unknown>,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error.status === 400 && error instanceof SyntaxError && 'body' in error) {
    next({ message: 'Bad query', exception: errorInvalidParameters('Malformed body') });
  } else {
    next(error);
  }
};

export default jsonBodyErrorHandlerMiddleware;
