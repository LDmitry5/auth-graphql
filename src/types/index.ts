export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  login: {
    token: string;
    user: User;
  };
}

export interface TreeNode {
  id: string;
  label: string;
  description?: string;
  children?: TreeNode[];
  isAssigned?: boolean;
  isInLibrary?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
