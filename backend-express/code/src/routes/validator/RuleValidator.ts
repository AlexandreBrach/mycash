import Joi from 'joi';

export const RuleValidator = Joi.object({
  amount: Joi.number().required(),
  categoryId: Joi.string(),
  id: Joi.number().required(),
  period: Joi.number().required(),
  start: Joi.string(),
  end: Joi.string().optional(),
});
