export interface User {
  name: string;
  password: string;
  role: string;
  email: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface ValidateSession {
  fromUser: string;
  sessionCode: string;
}
