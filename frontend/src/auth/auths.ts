import * as _ from "./config";

type LoginID = string;
type Password = string;

type Attributes = {
  email?: string;
  phone_number?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
  sub?: string;
};
type User = {
  username: LoginID;
  attributes?: Attributes;
};

export type SingInResult = User | Error;

export const singInSuccess = (result: SingInResult): result is User => {
  return (result as User).username !== undefined;
};
