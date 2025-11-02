import { Request } from 'express';
import { ResponseLocals } from '../infra/mvc/ResponseLocals';

const getWrapResponseMiddleware = () => {
  return (req: Request, res: ResponseLocals) => {
    res.send(res.locals.response);
  };
};

export default getWrapResponseMiddleware;
