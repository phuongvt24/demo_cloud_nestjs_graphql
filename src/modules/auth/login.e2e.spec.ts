import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';

describe('User test (e2e)', () => {
  let app: INestApplication;
  let client: GraphQLClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ValidationPipe)
      .useValue(new ValidationPipe({ transform: true }))
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const graphqlEndpoint = '/graphql';
    const graphqlUrl = `http://localhost:${process.env.APP_PORT}${graphqlEndpoint}`;
    client = new GraphQLClient(graphqlUrl);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Login with username and password', async () => {
    const query = `
      mutation login($userData: LoginInput!) {
          login(userData: $userData) {
               data{
                    auth{
                      accessToken
                      refreshToken
                    }
                    user{
                      userId
                      userName
                      name
                      email
                      
                    }
                  }
        }
      }
    `;
    const variables = {
      userData: {
        userName: 'thanhphuong242002',
        password: '@Phuong1234',
      },
    };
    const expectResponse = {
      userData: {
        userId: '31',
        userName: 'thanhphuong242002',
        name: 'Phương',
        email: '20521781@gm.uit.edu',
      },
    };

    const response = await client.request<any>(query, variables);

    const { accessToken, refreshToken } = response.login.data.auth;
    const { userId, name, userName, email } = response.login.data.user;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(userId).toBe(expectResponse.userData.userId);
    expect(userName).toBe(expectResponse.userData.userName);
    expect(email).toBe(expectResponse.userData.email);
    expect(name).toBe(expectResponse.userData.name);
  });

  it('Wrong username', async () => {
    const query = `
       mutation login($userData: LoginInput!) {
           login(userData: $userData) {
                data{
                     auth{
                       accessToken
                       refreshToken
                     }
                     user{
                       userId
                       userName
                       name
                       email
                       
                     }
                   }
         }
       }
     `;
    const variables = {
      userData: {
        userName: 'thanhphuong24200',
        password: '@Phuong1234',
      },
    };
    try {
      await client.request<any>(query, variables);
    } catch (error) {
      const errorMessage = error.response.errors[0].message;
      expect(errorMessage).toBe('Username does not exist, please check again');
    }
  });

  it('Wrong password', async () => {
    const query = `
        mutation login($userData: LoginInput!) {
            login(userData: $userData) {
                 data{
                      auth{
                        accessToken
                        refreshToken
                      }
                      user{
                        userId
                        userName
                        name
                        email
                        
                      }
                    }
          }
        }
      `;
    const variables = {
      userData: {
        userName: 'thanhphuong242002',
        password: 'Phuong1234',
      },
    };
    try {
      await client.request<any>(query, variables);
    } catch (error) {
      const errorMessage = error.response.errors[0].message;
      expect(errorMessage).toBe('Password is incorrect, please check again');
    }
  });
});
