import { Request, Response } from 'express';

const backendCheck = (req: Request, res: Response) =>
  res
    .status(200)
    .send(`Server is alive and healthy. Application version : ${process.env.APPLICATION_VERSION as string}.`);

export default backendCheck;
