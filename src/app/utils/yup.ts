import * as Yup from 'yup';

function formatErrors(err: Error | Yup.ValidationError) {
  if (err instanceof Yup.ValidationError) {
    return { errors: err.errors };
  }

  return { error: err };
}

export async function validateSchema(schema: Yup.ObjectSchema, params: object) {
  try {
    await schema.validate(params, { abortEarly: false });

    return undefined;
  } catch (exception) {
    return formatErrors(exception);
  }
}
