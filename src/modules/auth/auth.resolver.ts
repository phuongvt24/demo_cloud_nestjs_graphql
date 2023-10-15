import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { LoginAuthGuard } from '../../guards/login-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Mutation()
  @UseGuards(LoginAuthGuard)
  async login(@Args('userData') userData: LoginUserInput): Promise<any> {
    try {
      const user = await this.authService.login(userData);
      return { data: user };
    } catch (error) {
      throw new Error(error);
    }
  }
  @Mutation()
  async getAccessToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<any> {
    try {
      const auth = await this.authService.getAccessToken(refreshToken);
      return auth;
    } catch (error) {
      throw new Error(error);
    }
  }
}
