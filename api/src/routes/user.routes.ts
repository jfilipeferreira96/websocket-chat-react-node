import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/allusers/:id', userController.getAllUsers);

router.get('/logout/:id', userController.logOut);

export default router;
