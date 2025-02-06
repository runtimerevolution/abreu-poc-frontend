import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { AppContext } from "../../helpers/AppContext";
import { useNavigate } from "react-router-dom";

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

const Login = () => {
  const navigate = useNavigate()

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const isLoggedIn = sessionStorage.getItem('isloggedIn')

  useEffect(() => {
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn])


  const handleLogin = (e) => {
    e.preventDefault();

    if (userName === ADMIN_USER && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isloggedIn', true)
      navigate('/')
    }
  }


  return (
    <Container className="login">
      <h1>Login</h1>

      <Form onSubmit={handleLogin}>
        <Form.Control
          className="searchForm_input"
          type='text'
          placeholder='UserName'
          onChange={(e) => setUserName(e.target.value)}
        />
        <Form.Control
          className="searchForm_input"
          type='password'
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className='searchForm_submit' variant='primary' type='submit'>
          Entrar
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
