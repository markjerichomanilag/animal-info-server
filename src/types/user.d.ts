export interface IUser {
  username: string;
  password: string;
}

export interface IDocumentUser extends IUser {
  _id: string;
}

export interface ISignUpUserBody extends IUser {}

export interface ISignInUserBody extends IUser {}
