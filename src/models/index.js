// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Type = {
  "VOLUNTARIO": "VOLUNTARIO",
  "INSTITUICAO": "INSTITUICAO"
};

const { Match, User } = initSchema(schema);

export {
  Match,
  User,
  Type
};