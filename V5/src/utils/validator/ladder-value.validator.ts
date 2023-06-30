import {registerDecorator} from 'class-validator';

export function IsLadderValue() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsLadderValue',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        // validate(value: any, args: ValidationArguments) {
        validate(value: any) {
          // const [relatedPropertyName] = args.constraints;
          // const relatedValue = (args.object as any)[relatedPropertyName];
          return ['l', 'r', 3, 4, 'o', 'e'].some(e => e === value); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
