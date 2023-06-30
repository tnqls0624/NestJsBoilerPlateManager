import {registerDecorator} from 'class-validator';

export function IsLadderUnionValue() {
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
          if (!value) return true; // 필수값은 아니므로 null 이나 undefined도 허용한다.
          if (value === 0) return false;
          return ['l3e', 'l4o', 'r3o', 'r4e'].some(e => e === value); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
