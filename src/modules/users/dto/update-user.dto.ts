import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: 'Id khong hop le ' })
  @IsNotEmpty({ message: 'Id khong duoc de trong' })
  _id: string;
  @IsOptional()
  name: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  address: string;

  @IsOptional()
  image: string;
}
