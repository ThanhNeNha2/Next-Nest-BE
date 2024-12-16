import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customizePublic';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch Login ')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)

  @Public()
  @Post('register')
  async register(@Body() registerDto: CreateAuthDto) {
    return await this.authService.handleRegister(registerDto);
  }

  @Public()
  @Post('check-code')
  async checkCode(@Body() codeAuthDto: CodeAuthDto) {
    return await this.authService.handleCheckCode(codeAuthDto);
  }

  @Public()
  @Post('retry-active')
  async retryActive(@Body('email') email: string) {
    console.log('email 1 ', email);

    return await this.authService.retryActive(email);
  }
  @Public()
  @Get('mail')
  async testMail() {
    this.mailerService
      .sendMail({
        to: 'thanhhihihihi2@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register',
        context: {
          name: 'Eric',
          activationCode: '123456',
        },
      })
      .then(() => {})
      .catch(() => {});
    return 'ok';
  }
}
