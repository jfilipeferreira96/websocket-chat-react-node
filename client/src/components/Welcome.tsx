import { useEffect, useState } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
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
      <img src={Robot} alt="Welcome Gif" />
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
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;