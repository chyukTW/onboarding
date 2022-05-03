import { gql } from '@apollo/client';

// useReactiveVar Hook 사용하면 없어도 됨
export const GET_TASKS = gql`
	query GetTasks {
    getTasks {
      id
      text
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
