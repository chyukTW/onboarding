import { gql } from '@apollo/client';

export const GET_TASKS = gql`
	query GetTasks {
    getTasks {
      id
      text
      updatedAt
      updatedAtString @client
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: Int!) {
    getTask(id: $id){
      id
      text
    }
  }
`
