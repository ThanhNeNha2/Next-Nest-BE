import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hashPassword } from '@/helpers/utils';
import { CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  checkEmailExits = async (email: string) => {
    try {
      const checkEmail = await this.userModel.findOne({ email });
      if (checkEmail) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  async create(createUserDto: CreateUserDto) {
    try {
      const checkEmail = await this.checkEmailExits(createUserDto.email);
      if (checkEmail) {
        return 'Email da ton tai ';
      }
      const passHash = await hashPassword(createUserDto.password);

      return this.userModel.create({ ...createUserDto, password: passHash });
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(querys: any) {
    const { limit, skip } = querys;
    const users = await this.userModel.find({});
    const totalUser = users.length;
    const totalPage = Math.ceil(totalUser / limit);
    const skippage = (skip - 1) * limit;
    const chiatrang = this.userModel.find().skip(skippage).limit(limit);

    return chiatrang;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const userUpdate = await this.userModel.findByIdAndUpdate(
        { _id: updateUserDto._id },
        { ...updateUserDto },
      );
      return userUpdate;
    } catch (error) {
      console.log(error);
    }
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete({ _id: id });
  }

  //  SEARCH BBY EMAIL

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  // REGISTER

  async handleRegister(registerDto: CreateAuthDto) {
    try {
      const checkEmail = await this.checkEmailExits(registerDto.email);
      if (checkEmail) {
        return 'Email da ton tai ';
      }
      const passHash = await hashPassword(registerDto.password);
      const codeId = uuidv4();
      const user = await this.userModel.create({
        ...registerDto,
        password: passHash,
        isActive: false,
        codeExpired: dayjs().add(5, 'minutes'),
        codeId: codeId,
      });
      this.mailerService
        .sendMail({
          to: user?.email, // list of receivers
          subject: 'Activate your account at Website Of Thanh', // Subject line
          template: 'register',
          context: {
            name: user?.name ?? user?.email,
            activationCode: codeId,
          },
        })
        .then(() => {})
        .catch(() => {});
      return { id: user._id };
    } catch (error) {
      console.log(error);
    }
  }
  async handleActive(codeAuthDto: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: codeAuthDto._id,
      codeId: codeAuthDto.code,
    });
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn ');
    }
    const checkDay = dayjs().isBefore(user.codeExpired);
    if (checkDay) {
      await this.userModel.findByIdAndUpdate(
        { _id: codeAuthDto._id },
        {
          isActive: true,
        },
      );
      return 'Kich hoat thanh cong ';
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn ');
    }
  }

  async retryActive(email: string) {
    //  check xem người dùng có tồn tại hay không
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại ');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt ');
    }
    const codeId = uuidv4();
    await this.userModel.findOneAndUpdate(
      { email },
      {
        codeExpired: dayjs().add(5, 'minutes'),
        codeId: codeId,
      },
    );
    this.mailerService
      .sendMail({
        to: user?.email, // list of receivers
        subject: 'Activate your account at Website Of Thanh', // Subject line
        template: 'register',
        context: {
          name: user?.name ?? user?.email,
          activationCode: codeId,
        },
      })
      .then(() => {})
      .catch(() => {});
    return { id: user._id };
  }
}
