import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import CustomAuth from './components/CustomAuth';
import Dogs from './components/Dogs';
import AddDogForm from './components/AddDogForm';
import Favorites from './components/Favorites';
import BrowseLabrador from './components/BrowseLabrador';
import DogDetail from './components/DogDetail';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!user) {
    return <CustomAuth onAuthSuccess={setUser} />;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<Dogs user={user} signOut={handleSignOut} />} />
          <Route path="/add" element={<AddDogForm user={user} signOut={handleSignOut} />} />
          <Route path="/favorites" element={<Favorites user={user} signOut={handleSignOut} />} />
          <Route path="/browse" element={<BrowseLabrador user={user} signOut={handleSignOut} />} />
          <Route path="/dog/:id" element={<DogDetail user={user} signOut={handleSignOut} />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
