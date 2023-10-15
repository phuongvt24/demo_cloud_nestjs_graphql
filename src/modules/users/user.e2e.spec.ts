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

  it('Register a new user', async () => {
    const query = `
      mutation CreateUser($userData: RegisterUserInput!) {
        createUser(userData: $userData) {
          data {
            userId
            name
            userName
            email
          }
        }
      }
    `;
    const variables = {
      userData: {
        userName: 'TestUserddName1',
        password: 'TestPasswo1rd123456!',
        name: 'Test User1',
        email: 'testdd1213@example.com',
      },
    };

    const response = await client.request<any>(query, variables);

    const { userId, name, userName, email } = response.createUser.data;
    expect(userId).toBeDefined();
    expect(name).toBe(variables.userData.name);
    expect(userName).toBe(variables.userData.userName);
    expect(email).toBe(variables.userData.email);
  });

  it('Empty user name or empty password', async () => {
    const query = `
      mutation CreateUser($userData: RegisterUserInput!) {
        createUser(userData: $userData) {
          data {
            userId
            name
            userName
            email
          }
        }
      }
    `;
    const variables = {
      userData: {
        userName: '',
        password: 'TestPassword123456!',
        name: 'Test User1',
        email: 'test1213@example.com',
      },
    };

    try {
      await client.request<any>(query, variables);
    } catch (error) {
      const errorMessage =
        error.response.errors[0].extensions.originalError.message[0];
      expect(errorMessage).toBe('userName should not be empty');
    }
  });

  it('Wrong format password', async () => {
    const query = `
      mutation CreateUser($userData: RegisterUserInput!) {
        createUser(userData: $userData) {
          data {
            userId
            name
            userName
            email
          }
        }
      }
    `;
    const variables = {
      userData: {
        userName: 'Test',
        password: 'estPasswo1rd123456',
        name: 'Test User1',
        email: 'test1213@example.com',
      },
    };

    try {
      await client.request<any>(query, variables);
    } catch (error) {
      const errorMessage =
        error.response.errors[0].extensions.originalError.message[0];
      expect(errorMessage).toBe(
        'Password must be 8+ characters with 1 uppercase, 1 lowercase, 1 digit, and 1 special character.',
      );
    }
  });
});
