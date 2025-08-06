export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  birth_date: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio?: string;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterStep1 {
  first_name: string;
  last_name: string;
}

export interface RegisterStep2 {
  email: string;
}

export interface RegisterStep3 {
  gender: string;
  birth_date: string;
}

export interface RegisterStep4 {
  password: string;
  confirm_password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  birth_date: string;
  password: string;
  terms_accepted: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiError {
  detail: string;
}
