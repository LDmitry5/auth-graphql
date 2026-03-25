import { gql } from "@apollo/client";

export const GET_OBJECTS_QUERY = gql`
  query GetObjects {
    objects {
      id
      label
      description
      isAssigned
      isInLibrary
      children {
        id
        label
        description
        isAssigned
        isInLibrary
        children {
          id
          label
          description
        }
      }
    }
  }
`;
