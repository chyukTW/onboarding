import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { 
  ApolloServerPluginLandingPageGraphQLPlayground as playGround,
  ApolloServerPluginDrainHttpServer 
} from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import faker from '@faker-js/faker';
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import pubsub from "./pubsub";

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  
  const serverCleanup = useServer({ schema }, wsServer);
  
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  
  await server.start();
  
  server.applyMiddleware({ app });

  await new Promise<void>(r => httpServer.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`🚀 Subscription ready at ws://localhost:4000${server.graphqlPath}`);
}

startServer();

function publishRandomWord() {
  pubsub.publish("randomWord", {
    randomWord: faker.lorem.word(),
  });
  setTimeout(publishRandomWord, 1000);
};

publishRandomWord();