import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const graphQLConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  typePaths: ['./**/*.graphql'],
  playground: true,
};

export default graphQLConfig;
