import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
//import Home from './components/Home';
import Dogs from './components/Dogs';
import AddDogForm from './components/AddDogForm';




function App() {
  const [count, setCount] = useState(0)
  const user_pool_id = import.meta.env.VITE_USER_POOL_ID;
  const client_id = import.meta.env.VITE_CLIENT_ID;

  Amplify.configure({
    Auth: {
  Cognito: {
  userPoolId: user_pool_id,
  userPoolClientId: client_id,
  loginWith: {
  username: true,
  email: true,
  }
 }
 }
 });
  const formFields = {
  signUp: {
  email: {
  order: 1
  },
  given_name: {
  order: 2,
  label: 'First Name',
  },
  family_name: {
  order: 3,
  label: 'Last Name',
  },
  password: {
  order: 4
  },
  confirm_password: {
  order: 5
  }
  }
  };
  return (
     <Authenticator formFields={formFields}>
       {({ signOut, user }) => (
       <>
 <Router>
  <AppBar position="fixed">
    <Toolbar>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/dogs">Dogs</Button>
      <Button color="inherit" component={Link} to="/add">Add Dogs</Button>
      <Button color="inherit" onClick={signOut}>Logout</Button>
    </Toolbar>
  </AppBar>
 <Routes>
              <Route path="/" element={<Dogs />} />
              <Route path="/add" element={<AddDogForm />} />
              
            </Routes>
          </Router>
        </>
      )}
    </Authenticator>
  )
}
export default App
