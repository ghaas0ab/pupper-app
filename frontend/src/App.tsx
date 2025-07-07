import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dogs from './components/Dogs';
import AddDogForm from './components/AddDogForm';

function App() {
  const user_pool_id = import.meta.env.VITE_USER_POOL_ID;
  const client_id = import.meta.env.VITE_CLIENT_ID;

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: user_pool_id,
        userPoolClientId: client_id,
        loginWith: { username: true, email: true }
      }
    }
  });

  const formFields = {
    signUp: {
      email: { order: 1 },
      given_name: { order: 2, label: 'First Name' },
      family_name: { order: 3, label: 'Last Name' },
      password: { order: 4 },
      confirm_password: { order: 5 }
    }
  };

  return (
    <Authenticator formFields={formFields}>
      {({ signOut }) => (
        <Router>
          <Header onSignOut={signOut} />
          <Routes>
            <Route path="/" element={<Dogs />} />
            <Route path="/add" element={<AddDogForm />} />
          </Routes>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
