// Matches backend: LoginRequest.java
export interface LoginRequest {
  email: string;
  password: string;
}

// Matches backend: RegisterRequest.java
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'CUSTOMER' | 'OWNER' | 'AGENT';
}

// Matches backend: AuthResponse.java
export interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
  profilePicUrl?: string;
}

// Decoded JWT payload
export interface JwtPayload {
  sub: string;       // email
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

// Logged-in user stored in app state
export interface CurrentUser {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: 'CUSTOMER' | 'OWNER' | 'AGENT' | 'ADMIN';
  profilePicUrl?: string;
}
