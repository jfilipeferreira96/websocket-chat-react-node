import { Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
}

export interface IUserPayload {
  _id: string | Types.ObjectId;
  email: string;
}

export type AccessTokenPayload = IUserPayload;
export type RefreshTokenPayload = IUserPayload;
