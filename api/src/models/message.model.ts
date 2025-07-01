import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IMessage extends Document
{
  message: {
    text: string;
  };
  users: string[];
  sender: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Messages', MessageSchema);

export default MessageModel;