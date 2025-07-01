import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { v4 as uuid } from "uuid";
import ChatInput from "./ChatInput";
import { recieveMessageRoute, sendMessageRoute } from "../api/routes";
import styled from "styled-components";
import { ChatContainerIf } from "../types";

interface Message {
  fromSelf: boolean;
  message: string;
}

const ChatContainer = ({ currentChat, socket }: ChatContainerIf) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getMessages = async () =>
    {
      if (!user || !currentChat) return;

      try
      {
        const response = await fetch(recieveMessageRoute, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            from: user._id,
            to: currentChat._id,
          }),
        });

        if (response.status)
        {
          const data = await response.json();
          
          if (data) {
            setMessages(data.messages);
          }
        }
      } catch (err)
      {
        console.error("Failed to fetch messages", err);
      }
    };

    getMessages();
  }, [currentChat, user]);

  // Enviar mensagem
  const handleSendMsg = async (msg: string) =>
  {
    if (!user || !currentChat) return;

    socket.current?.emit("send-msg", {
      to: currentChat._id,
      msg,
    });

    try
    {
      await fetch(sendMessageRoute, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          from: user._id,
          to: currentChat._id,
          message: msg,
        }),
      });

      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    } catch (err)
    {
      console.error("Failed to send message", err);
    }
  };

  // Lidar com mensagens recebidas via socket (apenas um listener)
  useEffect(() =>
  {
    if (!socket.current) return;

    const messageListener = (msg: string) =>
    {
      setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
    };

    socket.current.on("msg-recieve", messageListener);

    return () =>
    {
      socket.current?.off("msg-recieve", messageListener);
    };
  }, [socket]);

  // Scroll para a última mensagem
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div ref={scrollRef} key={uuid()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: #f9fafb;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: #1f2937;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #cbd5e1;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #374151;
        background-color: #e5e7eb;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #dbeafe;
        color: #1e3a8a;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #e0e7ff;
        color: #3730a3;
      }
    }
  }
`;

export default ChatContainer