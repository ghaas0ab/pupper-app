import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import SwipeCard from './SwipeCard';
import Sidebar from './Sidebar';
import { dogService } from '../services/api';

interface DogDetails {
  id: string;
  name: string;
  species: string;
  shelter: string;
  city: string;
  state: string;
  description: string;
  birthday: string;
  weightInPounds: number;
  color: string;
  photo: string;
  shelterEntryDate: string;
}

interface DogsProps {
  user?: any;
  signOut?: () => void;
}

function Dogs({ user, signOut }: DogsProps) {
  const [dogs, setDogs] = useState<DogDetails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const fetchedDogs = await dogService.getAllDogs();
        setDogs(fetchedDogs);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchDogs();
  }, []);

  const handleLike = async () => {
    const currentDog = dogs[currentIndex];
    if (currentDog) {
      try {
        await dogService.recordInteraction(currentDog.id, 'LIKE');
      } catch (error) {
        console.error('Error recording like:', error);
      }
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleDislike = async () => {
    const currentDog = dogs[currentIndex];
    if (currentDog) {
      try {
        await dogService.recordInteraction(currentDog.id, 'DISLIKE');
      } catch (error) {
        console.error('Error recording dislike:', error);
      }
    }
    setCurrentIndex(prev => prev + 1);
  };

  const currentDog = dogs[currentIndex];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar user={user} onSignOut={signOut}/>
      <Box sx={{
        flex: 1,
        ml: '240px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 2,
        pb: 8
      }}>
        <Container maxWidth="sm">
          {currentDog ? (
            <SwipeCard
              dog={currentDog}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          ) : (
            <Box sx={{ textAlign: 'center', color: '#4a5568' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                No more dogs! 🐕
              </Typography>
              <Typography variant="h6">
                Check back later for more adorable pups
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default Dogs;
