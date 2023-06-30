// import {registerDecorator} from 'class-validator';
// import moment from 'moment-timezone';

// export function IsValidDate() {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       name: 'IsLadderValue',
//       target: object.constructor,
//       propertyName: propertyName,
//       validator: {
//         // validate(value: any, args: ValidationArguments) {
//         validate(value: any) {
//           // const [relatedPropertyName] = args.constraints;
//           // const relatedValue = (args.object as any)[relatedPropertyName];
//           return moment(value).isValid(); // you can return a Promise<boolean> here as well, if you want to make async validation
//         },
//       },
//     });
//   };
// }
