import { Request, Response, NextFunction } from 'express';
import Messages, { IMessage } from '../models/message.model';

interface IGetMessagesBody {
  from: string;
  to: string;
}

interface IAddMessageBody {
  from: string;
  to: string;
  message: string;
}

export const getMessages = async (req: Request<{}, {}, IGetMessagesBody>, res: Response, next: NextFunction): Promise<void> => {
  try
  {
    const { from, to } = req.body;
    
    const messages: IMessage[] = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json({ status: true, messages: projectedMessages });
  } catch (ex) {
    next(ex);
  }
};

export const addMessage = async (req: Request<{}, {}, IAddMessageBody>, res: Response, next: NextFunction): Promise<void> =>
{
  try
  {
    const { from, to, message } = req.body;
    const data: IMessage | null = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data)
    {
      res.json({ status: true, msg: "Message added successfully." });
    }
    else
    {
      res.json({ status: false, msg: "Failed to add message to the database" });
    }

  }
  catch (ex)
  {
    next(ex);
  }
};

export default {
  getMessages,
  addMessage,
};