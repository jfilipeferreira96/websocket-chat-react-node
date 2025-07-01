import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import Logger from '../utils/logger';

export const onlineUsers = new Map<string, string>();
const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL || "http://localhost:5173";

interface ISendMessageData
{
    to: string;
    message: string;
}

export const initializeWebSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: FRONTEND_APP_URL,
            credentials: true,
        },
    });

    io.on('connection', (socket: Socket) =>
    {
        /**
         * Ouve o evento 'join' para adicionar um utilizador à lista de online.
        */
        socket.on('join', (userEmail: string) =>
        {
            if (userEmail)
            {
                Logger.info(`User connected: ${userEmail} with socket id: ${socket.id}`);
                onlineUsers.set(userEmail, socket.id);
            }
        });

        /**
            Ouve o evento 'send-msg' para retransmitir uma mensagem a um utilizador específico.
        */
        socket.on('send-msg', (data: ISendMessageData) =>
        {
            const sendUserSocket = onlineUsers.get(data.to);
            if (sendUserSocket)
            {
                socket.to(sendUserSocket).emit('msg-recieve', data.message);
            }
        });

        /**
            Ouve o evento de desconexão para limpar o utilizador do Map
        */
        socket.on('disconnect', () => {
            for (const [key, value] of onlineUsers.entries())
            {
                if (value === socket.id)
                {
                    onlineUsers.delete(key);
                    Logger.info(`User disconnected: ${key}`);
                    break;
                }
            }
        });
    });

    return io;
};