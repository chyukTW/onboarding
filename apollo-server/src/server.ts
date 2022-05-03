import { ApolloServerPluginLandingPageGraphQLPlayground as playGround } from "apollo-server-core";
import { ApolloServer, gql } from 'apollo-server';
import { PrismaClient } from "@prisma/client";

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
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    playGround(),
  ]
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
