import {
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
} from 'class-validator';

export const Match = (
    property: string,
    validationOptions?: ValidationOptions,
) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'match',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const [relatedPropertyName] = args.constraints as [string];
                    const relatedValue = (
                        args.object as Record<string, unknown>
                    )[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args: ValidationArguments): string {
                    const [relatedPropertyName] = args.constraints as [string];
                    return `${args.property} must match ${relatedPropertyName}`;
                },
            },
        });
    };
};
