import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserInput } from './dto/login.input';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const existingUser = await this.userService.findByUsername(username);
    if (!existingUser) {
      throw new HttpException(
        'Username does not exist, please check again',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw new HttpException(
        'Password is incorrect, please check again',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (existingUser && passwordMatch) {
      const { password, ...result } = existingUser;
      return result;
    }
    return null;
  }

  async login(userData: LoginUserInput): Promise<any> {
    const User = await this.userService.findByUsername(userData.userName);
    try {
      const { userId, name, userName, email } = User;
      const payload = { sub: userId, username: userName };
      return {
        auth: {
          accessToken: await this.jwtService.signAsync(payload),
          refreshToken: await this.jwtService.signAsync(payload, {
            expiresIn: String(process.env.REFRESH_TOKEN_EXPIRATION_TIME),
          }),
        },
        user: {
          userId,
          name,
          userName,
          email,
        },
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAccessToken(refreshToken: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.SECRET_KEY_TOKEN,
      });
      const existingUser = await this.userService.findByUsername(
        verify.userName,
      );
      if (!existingUser) {
        throw new HttpException('Invalid refresh token', HttpStatus.NOT_FOUND);
      }
      const payload = {
        sub: verify.userId,
        username: verify.userName,
      };

      const newAccessToken = await this.jwtService.signAsync(payload);
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: String(process.env.REFRESH_TOKEN_EXPIRATION_TIME),
      });
      return {
        auth: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      };
    } catch (error) {
      throw new HttpException('Invalid refreshToken', HttpStatus.UNAUTHORIZED);
    }
  }
}
