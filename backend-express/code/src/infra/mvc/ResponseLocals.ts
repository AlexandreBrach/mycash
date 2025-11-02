import { Response } from 'express';
import { FactoryInterface } from '../../services/Factory';

export interface LocalsData {
  factory: FactoryInterface;
  response: any;
}

export interface ResponseLocals extends Response {
  locals: Response['locals'] & LocalsData;
}
