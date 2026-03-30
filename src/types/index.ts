export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface TreeNode {
  id: string;
  label?: string;
  name: string;
  description?: string;
  is_assigned?: boolean;
  in_library?: boolean;
  properties?: Property[];
  relations?: Relation[];
  children?: TreeNode[];
}

export interface Property {
  name: string;
  value: string;
  value_type: string;
  measure: string;
}

export interface Relation {
  name: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface LoginMutationResponse {
  login: AuthPayload;
}

export interface TreeQueryResponse {
  tree: TreeNode;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
