import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'email không được để trống ' })
  email: string;
  @IsNotEmpty({ message: 'password  không được để trống ' })
  password: string;
  @IsOptional()
  name: string;
}
export class CodeAuthDto {
  @IsNotEmpty({ message: '_Id không được để trống ' })
  _id: string;
  @IsNotEmpty({ message: 'Code  không được để trống ' })
  code: string;
}
