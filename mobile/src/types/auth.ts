export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio?: string;
  is_verified?: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
