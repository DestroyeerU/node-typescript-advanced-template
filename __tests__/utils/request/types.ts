import { User } from '@prisma/client';

export interface UseAutorization {
  key: string;
}

export type Autorizations = {
  [key in string | number]: {
    token: string;
    user: User;
  };
};

export interface Token {
  token?: string;
}

export interface MakeRequest {
  method: 'post' | 'get' | 'put' | 'delete';
  path: string;
  body?: never;
  tokenState?: Token;
}
