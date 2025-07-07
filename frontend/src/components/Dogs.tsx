import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Container, TextField } from '@mui/material';
import DogCard from './DogCard';
import SearchFilters from './SearchFilters';
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

function Dogs() {
  const [dogs, setDogs] = useState<DogDetails[]>([]);

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

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', pt: 10 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', gap: 3 }}>
          <SearchFilters />
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={3}>
              {dogs.map((dog) => (
                <Grid item xs={12} sm={6} md={4} key={dog.id}>
                  <DogCard dog={dog} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Dogs;
