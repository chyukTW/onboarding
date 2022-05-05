import { ApolloClient, InMemoryCache, split, HttpLink} from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({
  typePolicies: {
    Task: {
      fields: {
        updatedAtString: {
          read(_, { readField }) {
            const updatedAt = readField('updatedAt') as string;
            const time = new Date(parseInt(updatedAt));
            return `${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초`;
          },
        },
        text: { 
          read(existing) {
            return existing + '🌈';
          }
        }
      },  
    },
  },
});

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;