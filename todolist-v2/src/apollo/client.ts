import { ApolloClient, InMemoryCache } from "@apollo/client";

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
  uri: 'http://localhost:4000',
  cache,
});

export default client;