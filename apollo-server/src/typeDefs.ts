import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Task {
    id: Int!
    text: String!
    createdAt: String!
    updatedAt: String!
  }
  type User {
    name: String!
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
    getUsers: [User]
  }
  type Mutation {
    addTask(text: String): Result
    deleteTask(id: Int): Result
    updateTask(id: Int, text: String): Result
    createUser(name: String): Result
  }
  type Subscription {
    randomWord: String
  }
`;

export default typeDefs;