import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginStrategy } from '../../strategy/login.strategy';
import { JwtStrategy } from '../../strategy/jwt.strategy';
import { TaskMemberModule } from '../taskMember/taskMember.module';
import { RolesGuard } from '../../guards/roles-auth.guard';

@Module({
  imports: [
    UserModule,
    TaskMemberModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY_TOKEN,
      signOptions: { expiresIn: String(process.env.TOKEN_EXPIRATION_TIME) },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    LoginStrategy,
    JwtStrategy,
    RolesGuard,
  ],
})
export class AuthModule {}
