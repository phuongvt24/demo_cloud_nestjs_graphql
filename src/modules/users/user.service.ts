import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterUserInput } from './dto/user.register.input';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByUsername(userName: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { userName } });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUserId(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async createUser(userData: RegisterUserInput): Promise<any> {
    const { userName, password, email } = userData;

    const existingUserByUserName = await this.findByUsername(userName);
    if (existingUserByUserName) {
      throw new HttpException('Username already exists.', HttpStatus.CONFLICT);
    }

    const existingUserByEmail = await this.findByEmail(email);
    if (existingUserByEmail) {
      throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      const { userId, name, userName, email } = savedUser;
      return { userId, name, userName, email };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateKeyAvatar(userId: number, key: string): Promise<any> {
    const userToUpdate = await this.findByUserId(userId);
    if (!userToUpdate) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    userToUpdate.avatar = key;
    const userUpdated = await this.userRepository.save(userToUpdate);
    if (userUpdated) {
      return true;
    }
    return false;
  }

  async createKeyAvatar(userId: number): Promise<any> {
    const user = await this.findByUserId(userId);
    const keyAvt = user?.avatar;
    if (!keyAvt) {
      const keyAvt = `${randomUUID()}.${userId}`;
      return keyAvt;
    }
    return keyAvt;
  }

  async getAvatarPresignedUrl(userId: number): Promise<any> {
    const s3 = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
      region: String(process.env.s3_REGION),
      signatureVersion: 'v4',
    });

    try {
      const key = await this.createKeyAvatar(userId);
      const updateKeyAvatar = this.updateKeyAvatar(userId, key);
      if (updateKeyAvatar) {
        const s3Params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Expires: +process.env.S3_EXPIRES,
        };
        const uploadUrl = s3.getSignedUrl('putObject', s3Params);
        return uploadUrl;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
