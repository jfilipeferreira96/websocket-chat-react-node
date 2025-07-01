import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Contact, ContactsIf } from '../types'
import { useUser } from '../context/UserContext'
import userImageDefault from "../assets/kindpng_2765521.png";
import dogFace from "../assets/1547181160dog-face-clip-art-png.png";
import dogFace2 from "../assets/pngwing.com.png";
import Logout from './Logout';


export const Contacts = ({ contacts, changeChat }: ContactsIf) => {
  const { user } = useUser();

  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserImage, setCurrentUserImage] = useState<string>("");
  const [currentSelected, setCurrentSelected] = useState<number | null>(null);

  useEffect(() => {
    if (user)
    {
      setCurrentUserName(user.username ?? "");
    }
  }, [user]);

  const changeCurrentChat = (index: number, contact: Contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <Container>
      <div className="brand">
        <h3>Chat</h3>
      </div>

      <div className="contacts">
        {contacts.length === 0 ? (
          <p className="no-contacts">Oops! No contacts found. Try creating another account to start chatting.</p>
        ) : (
          contacts.map((contact, index) => (
            <div key={contact._id} className={`contact ${index === currentSelected ? "selected" : ""}`} onClick={() => changeCurrentChat(index, contact)}>
              <div className="avatar">
                <img src={userImageDefault} alt={contact._id} />
              </div>
              <div className="username">
                <h3>{contact.username}</h3>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="current-user">
        <div className="avatar">
          <img src={dogFace} alt="avatar" />
        </div>
        <div className="username">
          <h2>{currentUserName}</h2>
        </div>
        <Logout />
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #f3f4f6;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    img {
      height: 2rem;
    }

    h3 {
      color: #374151;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 1rem;
    }

    .contact {
      background-color: #e5e7eb;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.5rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: background-color 0.3s ease-in-out;

      .avatar img {
        height: 3rem;
      }

      .username h3 {
        color: #1f2937;
      }
    }

    .selected {
      background-color: #6366f1;

      .username h3 {
        color: white;
      }
    }

    .no-contacts {
      color: #6b7280;
      font-size: 1rem;
      text-align: center;
      padding: 1rem;
      max-width: 80%;
    }
  }

  .current-user {
    background-color: #e2e8f0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .avatar img {
      height: 4rem;
      max-inline-size: 100%;
    }

    .username h2 {
      color: #1f2937;
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;

      .username h2 {
        font-size: 1rem;
      }
    }
  }
`;
