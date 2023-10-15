// start-before-end.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStartBeforeEnd(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStartBeforeEnd',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const start = new Date(value);
          const end = new Date(args.object['end']);
          return start < end;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be before end.`;
        },
      },
    });
  };
}
