import styled from 'styled-components'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react'
import { registerRoute } from '../api/routes'
import { Data } from '../types'
import Loader from '../components/Loader'
import { useUser } from '../context/UserContext'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, setUser } = useUser()

  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  }

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    if (user !== null)
    {
      navigate('/')
    }
  }, [user, navigate])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    
    if (password !== confirmPassword)
    {
      toast.error("Password and confirm password should be the same.", toastOptions)
      return false
    }
    if (username.length < 3)
    {
      toast.error("Username should be at least 3 characters.", toastOptions)
      return false
    }
    if (password.length < 8)
    {
      toast.error("Password should be at least 8 characters.", toastOptions)
      return false
    }
    if (email === "")
    {
      toast.error("Email is required", toastOptions)
      return false
    }
    return true
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!handleValidation()) {
      setLoading(false)
      return
    }

    const { email, username, password } = values;

    try {
      const response = await fetch(registerRoute, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      })

      const data: Data = await response.json()
      setLoading(false)

      if (!response.ok || data.status === false)
      {
        const errorMsg = data?.msg || response.statusText || "Registration failed"
        toast.error(errorMsg, toastOptions)
        return
      }

      setUser(data.user)
      navigate('/')
    } catch (err) {
      setLoading(false)
      toast.error("Network error or server not responding", toastOptions)
    }
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
         
          <input
            type="text"
            placeholder='Username'
            name='username'
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder='Email'
            name='email'
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder='Password'
            name='password'
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder='Confirm Password'
            name='confirmPassword'
            onChange={handleChange}
          />
          <button type='submit'>Create User</button>
          <span>Already have an account? <Link to={"/login"}>Login</Link></span>
        </form>
        {loading && <Loader />}
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #f3f4f6;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: #374151;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #ffffff;
    border-radius: 1.5rem;
    padding: 3rem 5rem;
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

export default Register
