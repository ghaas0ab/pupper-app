import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, Chip, TextField, InputAdornment } from '@mui/material';
import { LocationOn, Search } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { dogService } from '../services/api';

interface Dog {
  id: string;
  name: string;
  species: string;
  city: string;
  state: string;
  photo: string;
  thumbnailPhoto?: string;
  weightInPounds: number;
  color: string;
  description: string;
  birthday: string;
}

interface BrowseLabradorProps {
  user?: any;
  signOut?: () => void;
}

export default function BrowseLabrador({ user, signOut }: BrowseLabradorProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const fetchedDogs = await dogService.getAllDogs();
        const labradors = fetchedDogs.filter(dog => 
          dog.species.toLowerCase().includes('labrador')
        );
        setDogs(labradors);
        setFilteredDogs(labradors);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchDogs();
  }, []);

  useEffect(() => {
    const filtered = dogs.filter(dog =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.color.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDogs(filtered);
  }, [searchTerm, dogs]);

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar user={user} onSignOut={signOut} />
      <Box sx={{
        flex: 1,
        ml: '240px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        py: 4
      }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
              🐕 Browse Labrador
            </Typography>
            <Typography variant="h6" sx={{ color: '#718096', mb: 3 }}>
              All Labrador dogs available for adoption
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Search by name, location, or color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#718096' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400, backgroundColor: 'white', borderRadius: 2 }}
            />
          </Box>

          <Grid container spacing={3}>
            {filteredDogs.map((dog) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={dog.thumbnailPhoto || dog.photo}
                    alt={dog.name}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {dog.name}, {calculateAge(dog.birthday)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#718096', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: '#718096' }}>
                        {dog.city}, {dog.state}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={dog.species} size="small" />
                      <Chip label={`${dog.weightInPounds} lbs`} size="small" />
                      <Chip label={dog.color} size="small" />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      {dog.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredDogs.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#4a5568' }}>
                No dogs found matching "{searchTerm}"
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
