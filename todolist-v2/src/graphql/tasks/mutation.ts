import { gql } from '@apollo/client';

export const DELETE_TASK = gql`
	mutation DeleteTask($id: Int!) {
    deleteTask(id: $id) {
      ok
      error
    }
  }
`;

export const ADD_TASK = gql`
	mutation AddTask($text: String!) {
    addTask(text: $text) {
      ok
      error
    }
  }
`;