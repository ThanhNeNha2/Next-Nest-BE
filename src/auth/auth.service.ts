import { comparePassword } from '@/helpers/utils';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    const checkPass = await comparePassword(pass, user.password);
    if (checkPass) {
      const payload = { sub: user._id, username: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }
}
