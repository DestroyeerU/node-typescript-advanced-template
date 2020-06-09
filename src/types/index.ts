import { Request as DefaultRequest } from 'express';

interface ParamsDictionary {
  [key: string]: string;
}

interface Query {
  [key: string]: string | Query | Array<string | Query>;
}

export interface RequestBody<B> extends DefaultRequest {
  body: B;
}

export interface RequestParams<P extends ParamsDictionary> extends DefaultRequest {
  params: P;
}

export interface RequestQuery<Q extends ParamsDictionary> extends DefaultRequest {
  params: Q;
}

export interface Request<T, P extends ParamsDictionary, Q extends Query> extends DefaultRequest {
  body: T;
  params: P;
  query: Q;
}

export interface RequestBodyParamsId<T> extends DefaultRequest {
  body: T;
  params: {
    id: string;
  };
}

export interface RequestParamsId extends DefaultRequest {
  params: {
    id: string;
  };
}
