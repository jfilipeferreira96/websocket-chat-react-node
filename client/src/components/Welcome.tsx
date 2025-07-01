import { useEffect, useState } from "react";
import styled from "styled-components";
import WelcomeGif from "../assets/d9252dbe4d8f1a9fee4212e80b60c64a.gif";
import { useUser } from "../context/UserContext";

export const Welcome = () => {
  const { user } = useUser();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user?.username)
    {
      setUserName(user.username);
    }
  }, [user]);

  return (
    <Container>
      <img src={WelcomeGif} alt="Welcome Gif" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #1f2937;
  flex-direction: column;
  background-color: #f3f4f6;

  img {
    height: 18rem;
  }

  span {
    color: #6366f1;
    font-weight: 600;
  }
`;
