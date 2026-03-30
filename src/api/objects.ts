import { gql } from "@apollo/client";

export const GET_TREE_QUERY = gql`
  query GetTree {
    tree {
      id
      label
      name
      description
      is_assigned
      in_library
      properties {
        name
        value
        value_type
        measure
      }
      relations {
        name
      }
      children {
        id
        label
        name
        description
        is_assigned
        in_library
        children {
          id
          label
          name
          description
        }
      }
    }
  }
`;
