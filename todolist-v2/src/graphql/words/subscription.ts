import { gql } from "@apollo/client";

export const WORD_SUBSCRIPTION = gql`
  subscription {
    randomWord 
  }
`;