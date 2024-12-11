import { comparePassword } from '@/helpers/utils';
import { UsersService } from '@/modules/users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // thư viện tự biết mà chạy tới cái này để đăng nhập sau đó trả về user cho guard

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException("Can't found account");
    }
    const checkPass = await comparePassword(pass, user.password);

    if (!checkPass) {
      throw new UnauthorizedException('Email or Pass wrong ');
    }
    return user;
  }

  // sau đó dùng hàm này để in ra
  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //  REGISTER

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };
}
