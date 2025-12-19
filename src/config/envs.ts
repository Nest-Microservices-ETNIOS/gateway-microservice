import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
  ORDERS_MICROSERVICE_HOST: string;
  ORDERS_MICROSERVICE_PORT: number;
}

// validamos mediante un esquema
const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  PRODUCTS_MICROSERVICE_HOST: Joi.string().required(),
  PRODUCTS_MICROSERVICE_PORT: Joi.number().required(),
  ORDERS_MICROSERVICE_HOST: Joi.string().required(),
  ORDERS_MICROSERVICE_PORT: Joi.number().required(),
}).unknown(true);
// el unknown es por si hay mas variables de entorno las deje pasar sin validar

const { error, value } = envsSchema.validate(process.env) as {
  error?: Joi.ValidationError;
  value: EnvVars;
};

// console.log({ envsVars });
// console.log({ error });

if (error) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

const envsVars = value;

export const envs = {
  port: envsVars.PORT,
  productsMicroserviceHost: envsVars.PRODUCTS_MICROSERVICE_HOST,
  productsMicroservicePort: envsVars.PRODUCTS_MICROSERVICE_PORT,
  ordersMicroserviceHost: envsVars.ORDERS_MICROSERVICE_HOST,
  ordersMicroservicePort: envsVars.ORDERS_MICROSERVICE_PORT,
};
