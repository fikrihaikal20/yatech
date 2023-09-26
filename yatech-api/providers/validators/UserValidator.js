import Ajv from 'ajv';

const ajv = new Ajv();

const updateUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3 },
    no_handphone: { type: 'string', minLength: 3 },
    alamat: { type: 'string', minLength: 3 },
  },
  required: ['name', 'no_handphone', 'alamat'],
};

// Validator
export const updateUserValidator = ajv.compile(updateUserSchema);



