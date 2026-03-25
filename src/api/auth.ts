import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($credentials: LoginInput!) {
    login(credentials: $credentials) {
      token
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
