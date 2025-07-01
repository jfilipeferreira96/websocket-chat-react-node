import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import { logoutRoute } from "../api/routes";
import { useUser } from "../context/UserContext";

const Logout = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleClick = async () =>
  {
    if (!user) return;

    try
    {
      const response = await fetch(`${logoutRoute}/${user._id}`, {
        method: "GET",
      });

      if (response.status)
      {
        logout();
        navigate("/login");
      }
    } catch (err)
    {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Button onClick={handleClick} title="Logout">
      <BiPowerOff />
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgb(99, 102, 241);
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
export default Logout