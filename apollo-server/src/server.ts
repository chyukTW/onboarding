import express from "express";
import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from 'apollo-server-express';
import { 
  ApolloServerPluginLandingPageGraphQLPlayground as playGround,
  ApolloServerPluginDrainHttpServer 
} from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import faker from '@faker-js/faker';

const pubsub = new PubSub();

const client = new PrismaClient();

const typeDefs = gql`
  type Task {
    id: Int!
    text: String!
    createdAt: String!
    updatedAt: String!
  }
  type Result {
    ok: Boolean!
    error: String
  }
  type Query {
    getTasks: [Task]
    getTask(id: Int!): Task
  }
  type Mutation {
    addTask(text: String): Result
    deleteTask(id: Int): Result
    updateTask(id: Int, text: String): Result
  }
  type Subscription {
    messageAdded: String
  }
`;

const resolvers = {
  Query: {
    getTasks: () => client.task.findMany(),
    getTask: (_: any, { id }: any) => {
      return client.task.findUnique({where: {
        id
      }});
    }
  },
  Mutation: {
    addTask: async (_: any, { text }: any) => {
      try {
        await client.task.create({
          data: {
            text
          }
        })
  
        return {
          ok: true,
        }
      } catch(e) {
        return {
          ok: false,
          error: e
        }
      }
    },
    deleteTask: async (_: any, { id }: any) => {
      try{
        const task = await client.task.findUnique({where: {id}});
  
        if(!task){
          return {
            ok: false,
            error: 'No Task'
          }
        }
  
        await client.task.delete({ where: {id}});
  
        return {
          ok: true
        }
      }catch(e){
        return {
          ok: false,
          error: e
        }
      }
    },
    updateTask: async (_: any, { id, text }: any) => {
      try{
        const task = await client.task.findUnique({where: {id}});

        if(!task){
          return {
            ok: false,
            error: 'No Task'
          }
        }

        await client.task.update({ 
          where: { id },
          data: {
            text
          }
        });

        return {
          ok: true
        }
      } catch(e) {
        return {
          ok: false,
          error: e
        }
      }
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator("messageAdded"),
    },
  },
};

setInterval(() => {
  pubsub.publish("messageAdded", {
    messageAdded: faker.lorem.sentence(),
  });
}, 1000);

async function startServer() {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      playGround(),
    ],
  });

  await apollo.start();

  const app = express();

  apollo.applyMiddleware({ app });

  await new Promise<void>(r => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${apollo.graphqlPath}`);
}

startServer();