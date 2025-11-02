import { FactoryInterface } from '../../services/Factory';

import 'express';

declare global {
  namespace Express {
    interface Locals {
      factory: FactoryInterface;
    }
  }
}
