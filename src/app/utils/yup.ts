import * as Yup from 'yup';

export async function validateSchema(schema: Yup.ObjectSchema, params: object) {
  try {
    await schema.validate(params);

    return undefined;
  } catch (exception) {
    if (exception instanceof Yup.ValidationError) {
      return { error: exception.message };
    }

    return { error: exception };
  }
}
