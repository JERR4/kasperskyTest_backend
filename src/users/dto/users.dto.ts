import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

import { User } from '../models/user.entity';

@ValidatorConstraint({ async: false })
export class IsValidNameConstraint implements ValidatorConstraintInterface {
  validate(name: string) {
    if (!name) return false;
    if (name.length < 2 || name.length > 30) return false;

    let isLatin = false;
    let isCyrillic = false;
    for (let i = 0; i < name.length; i++) {
      const char = name[i];
      if (char === ' ') {
        if (i > 0 && name[i - 1] === ' ') return false;
        continue;
      }
      const code = char.charCodeAt(0);
      if (
        ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) &&
        !isCyrillic
      ) {
        isLatin = true;
      } else if (
        ((code >= 1040 && code <= 1103) || code === 1025 || code === 1105) &&
        !isLatin
      ) {
        isCyrillic = true;
      } else {
        return false;
      }
    }
    return true;
  }

  defaultMessage() {
    return 'Имя должно содержать только буквы одного алфавита, 2–30 символов, и не более одного пробела подряд';
  }
}

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidNameConstraint,
    });
  };
}

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  age: number;
  group?: { id: number; name: string };
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.age = user.age;
    if (user.group) {
      this.group = { id: user.group.id, name: user.group.name };
    }
  }
}

export class CreateUserDto {
  @IsValidName()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsOptional()
  @IsInt()
  groupId?: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsValidName()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsInt()
  groupId?: number;
}
