import { Request, Response } from 'express';

const getWrapResponseMiddleware = () => {
  return (req: Request, res: Response) => {
    res.send(res.locals.response);
  };
};

export default getWrapResponseMiddleware;
