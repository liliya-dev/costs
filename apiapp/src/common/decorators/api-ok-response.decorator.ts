import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { ResponseDto } from '../dtos/response.dto';

export const ApiOkResponseDecorator = <TModel extends Type<any>>(
  model: TModel,
  isArray?: boolean,
): Function => {
  const schema = isArray
    ? {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      }
    : { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: schema,
            },
          },
        ],
      },
    }),
  );
};
