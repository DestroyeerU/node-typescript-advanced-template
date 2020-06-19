import { Request as DefaultRequest } from 'express';

interface ParamsDictionary {
  [key: string]: string;
}

interface Query {
  [key: string]: undefined | string | string[] | Query | Query[];
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

export interface Request<B, P extends ParamsDictionary, Q extends Query> extends DefaultRequest {
  body: B;
  params: P;
  query: Q;
}

export interface RequestBodyParamsId<B> extends DefaultRequest {
  body: B;
  params: {
    id: string;
  };
}

export interface RequestParamsId extends DefaultRequest {
  params: {
    id: string;
  };
}
