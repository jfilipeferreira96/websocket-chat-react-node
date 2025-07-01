import { Router } from 'express';
import messageController from '../controllers/message.controller';

const router = Router();

router.post('/', messageController.addMessage); // POST /api/messages

router.post('/list', messageController.getMessages); // POST /api/messages/list

export default router;
