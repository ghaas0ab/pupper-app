import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dogs from './components/Dogs';
import AddDogForm from './components/AddDogForm';
import Favorites from './components/Favorites';
import BrowseLabrador from './components/BrowseLabrador';
import DogDetail from './components/DogDetail';

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
    {({ signOut, user }) => (
      <Router>
        <Routes>
          <Route path="/" element={<Dogs user={user} signOut={signOut} />} />
          <Route path="/add" element={<AddDogForm user={user} signOut={signOut} />} />
          <Route path="/favorites" element={<Favorites user={user} signOut={signOut} />} />
          <Route path="/browse" element={<BrowseLabrador user={user} signOut={signOut} />} />
          <Route path="/dog/:id" element={<DogDetail user={user} signOut={signOut} />} />
        </Routes>
      </Router>
    )}
  </Authenticator>
);
}

export default App;