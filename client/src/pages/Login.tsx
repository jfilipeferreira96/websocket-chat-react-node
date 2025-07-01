import { useState, useEffect, ChangeEventHandler, FormEventHandler } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, useUser } from "../context/UserContext";
import Loader from "../components/Loader"; 
import styled from "styled-components";
import { loginRoute } from "../api/routes";

type Data = {
  status: boolean;
  msg?: string;
  user?: User;
};

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [values, setValues] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // Redireciona se já estiver logado
  useEffect(() =>
  {
    if (user)
    {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
  {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () =>
  {
    const { username, password } = values;
    if (!username || !password)
    {
      toast.error("Username and Password are required", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) =>
  {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const { username, password } = values;

    try
    {
      const response = await fetch(loginRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data: Data = await response.json();
      setLoading(false);
      
      if (!response.ok || !data.status || !data.user)
      {
        toast.error(data.msg || response.statusText, toastOptions);
        return;
      }

      setUser(data.user);
      navigate("/");
    } catch (error)
    {
      setLoading(false);
      toast.error("Network error", toastOptions);
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            minLength={3}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
          <span>
            Don't have an account? <Link to="/register">Create One</Link>
          </span>
        </form>

        {loading && <Loader />}
      </FormContainer>
      <ToastContainer />
    </>
  );
};


const FormContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #f3f4f6; 

  .textHelper {
    color: #374151; 
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #ffffff; 
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); 
  }

  input {
    background-color: #f9fafb; 
    padding: 1rem;
    border: 1px solid #cbd5e1; 
    border-radius: 0.5rem;
    color: #111827; 
    width: 100%;
    font-size: 1rem;
    transition: 0.3s ease border-color;
    &:focus {
      border-color: #6366f1; 
      outline: none;
    }
  }

  button {
    background-color: #6366f1; 
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.3s ease background-color;
    &:hover {
      background-color: #4f46e5;
    }
  }

  span {
    color: #6b7280; 
    text-transform: uppercase;
    font-size: 0.875rem;
    a {
      color: #6366f1;
      text-decoration: none;
      font-weight: bold;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;


export default Login;
