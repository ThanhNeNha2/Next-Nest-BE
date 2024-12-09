import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Vui lòng nhập name ' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email  nhập không đúng định dạng ! ' })
  email: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu  ' })
  password: string;

  phone: string;

  address: string;

  image: string;
}
