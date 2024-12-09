import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hashPassword } from '@/helpers/utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
}
