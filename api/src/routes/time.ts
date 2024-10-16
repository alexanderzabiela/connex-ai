import { Router } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';

const router = Router();
const ajv = new Ajv();

// Define the JSON schema
interface TimeResponse {
  epoch: number;
}

const schema: JSONSchemaType<TimeResponse> = {
  type: 'object',
  properties: {
    epoch: {
      type: 'number',
      description: 'The current server time, in epoch seconds, at time of processing the request.',
    },
  },
  required: ['epoch'],
};

// Compile the schema
const validate = ajv.compile(schema);

router.get('/', (req, res) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const responseData: TimeResponse = { epoch: currentTime };

  // Validate the response data
  const valid = validate(responseData);

  if (!valid) {
    // If validation fails, send a 500 error with validation errors
    res.status(500).json({ error: 'Response validation failed', details: validate.errors });
  } else {
    res.json(responseData);
  }
});

export default router;
