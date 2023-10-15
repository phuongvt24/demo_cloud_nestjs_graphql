import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { RegisterUserInput } from './dto/user.register.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation()
  async createUser(
    @Args('userData') userData: RegisterUserInput,
  ): Promise<any> {
    try {
      const createdUser = await this.userService.createUser(userData);
      return { data: createdUser };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async getAvatarPresignedUrl(@Context() context): Promise<any> {
    try {
      const userId = context.req.user.userId;
      const url = await this.userService.getAvatarPresignedUrl(userId);
      console.log(url);
      return { data: { url: url } };
    } catch (error) {
      throw new Error(error);
    }
  }
}
