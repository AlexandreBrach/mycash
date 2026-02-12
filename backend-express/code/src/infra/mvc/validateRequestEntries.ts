import { ArraySchema, ObjectSchema } from 'joi';
import { BadRequest } from './WebExceptions';

const validateRequestEntries = <T>(schema: ObjectSchema<T> | ArraySchema, subject: any): T => {
  const validation = schema.validate(subject);
  if (validation.error) {
    throw new BadRequest(validation.error.message);
  }
  return validation.value as unknown as T;
};

export default validateRequestEntries;
