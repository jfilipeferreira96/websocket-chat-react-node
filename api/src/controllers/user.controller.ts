import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user.model';
import { onlineUsers } from '../services/websocket';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try
  {
    const { username, password } = req.body;
    const user: IUser | null = await User.findOne({ username });

    if (!user)
    {
      res.json({ msg: "Incorrect Username or Password", status: false });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
    {
      res.json({ msg: "Incorrect Username or Password", status: false });
      return;
    }

    const userResponse = { _id: user._id, username: user.username, email: user.email };

    res.json({ status: true, user: userResponse });
  } catch (ex)
  {
    next(ex);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try
  {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
    {
      res.json({ msg: "Username already used", status: false });
      return;
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
    {
      res.json({ msg: "Email already used", status: false });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const userResponse = { _id: user._id, username: user.username, email: user.email };

    res.json({ status: true, user: userResponse });
  } catch (ex)
  {
    next(ex);
  }
};

export const getAllUsers = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> =>
{
  try
  {
    const users: IUser[] = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);
    res.json(users);
  } catch (ex)
  {
    next(ex);
  }
};

export const logOut = (req: Request<{ id: string }>, res: Response, next: NextFunction): void =>
{
  try
  {
    if (!req.params.id)
    {
      res.json({ msg: "User id is required " });
      return;
    }
    
    onlineUsers.delete(req.params.id);
    res.status(200).send({ status: true });
  } catch (ex)
  {
    next(ex);
  }
};

export default {
  login,
  register,
  getAllUsers,
  logOut,
};