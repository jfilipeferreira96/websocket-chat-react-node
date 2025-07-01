import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';
import { User } from './context/UserContext';

export interface Data {
  status : boolean
  user : User
  msg: string
}

export type Contact = {
  _id: string
  username: string
}

export interface ContactsIf {
  contacts: Array<Contact>
  changeChat: (param: Contact) => void
}

export interface ChatContainerIf {
  currentChat : Contact
  socket : MutableRefObject<Socket>
}
