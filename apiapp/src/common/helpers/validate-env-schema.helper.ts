import * as Joi from 'joi';

import { NODE_ENV } from 'src/constants/app.constant';

export const validateEnvSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .required()
    .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION),
  SERVER_PORT: Joi.number().default(3000),
  DEPLOY_HOST: Joi.string().allow(''),
});
