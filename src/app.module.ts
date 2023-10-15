import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/mySql';
import { GraphQLModule } from '@nestjs/graphql';
import graphQLConfig from './config/graphQL';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/tasks/task.module';
import { TaskMemberModule } from './modules/taskMember/taskMember.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRoot(graphQLConfig),
    UserModule,
    AuthModule,
    TaskModule,
    TaskMemberModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
