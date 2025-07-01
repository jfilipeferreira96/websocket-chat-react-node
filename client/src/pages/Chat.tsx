import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import styled from 'styled-components'
import { allUsersRoute, host } from '../api/routes'
import ChatContainer from '../components/ChatContainer'
import { Contacts } from '../components/Contacts'
import { Welcome } from '../components/Welcome'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Contact } from '../types'
import { useUser } from '../context/UserContext'

const Chat = () => {
  const navigate = useNavigate()
  const socket = useRef() as MutableRefObject<Socket>
  const [contacts, setContacts] = useState<Contact[]>([])
  const [currentChat, setCurrentChat] = useState<Contact | undefined>(undefined)
  const { user } = useUser()

  useEffect(() => {
    if (!user)
    {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    if (user)
    {
      socket.current = io(host)
      socket.current.emit('join', user.email)
    }
  }, [user])

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return
      if (user)
      {
        const response = await fetch(`${allUsersRoute}/${user._id}`)
        const data = await response.json()
        setContacts(data);
      }
    }

    fetchContacts()
  }, [user, navigate])

  const handleChatChange = (chat: Contact) => {
    setCurrentChat(chat)
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #f3f4f6;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #ffffff;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;


export default Chat
