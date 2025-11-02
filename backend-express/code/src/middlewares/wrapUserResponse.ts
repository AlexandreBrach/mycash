import { Request, Response } from 'express';

const getWrapUserResponseMiddleware = () => {
  return (req: Request, res: Response) => {
    res.send(res.locals.response);
  };
};

export default getWrapUserResponseMiddleware;
