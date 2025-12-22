import { NextFunction, Request, Response } from 'express';

const jsonErrorFormatter = (error: Record<string, unknown>, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const errorStatus = error?.status || error?.httpCode || 500;
  const status: number = typeof errorStatus === 'number' ? errorStatus : 500;
  res.status(status);

  const message = status === 404 ? 'Not Found' : error?.publicMessage || 'Server Error';
  res.send({ message });
};

export default jsonErrorFormatter;
