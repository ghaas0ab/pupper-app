import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Card, CardMedia, Chip, Button, Grid } from '@mui/material';
import { ArrowBack, LocationOn } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { dogService } from '../services/api';

interface Dog {
  id: string;
  name: string;
  species: string;
  city: string;
  state: string;
  shelter: string;
  photo: string;
  originalPhoto?: string;
  weightInPounds: number;
  color: string;
  description: string;
  birthday: string;
  shelterEntryDate: string;
}

interface DogDetailProps {
  user?: any;
  signOut?: () => void;
}

export default function DogDetail({ user, signOut }: DogDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = React.useState<Dog | null>(null);

  React.useEffect(() => {
    const fetchDog = async () => {
      try {
        const dogData = await dogService.getDogById(id!);
        setDog(dogData);
      } catch (error) {
        console.error('Error fetching dog:', error);
        setDog(null);
      }
    };
    
    if (id) fetchDog();
  }, [id]);

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  if (!dog) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Sidebar user={user} onSignOut={signOut} />
        <Box sx={{ flex: 1, ml: '240px', p: 4 }}>
          <Typography>Dog not found</Typography>
        </Box>
      </Box>
    );
  }

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
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="500"
                  image={dog.originalPhoto || dog.photo}
                  alt={dog.name}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                {dog.name}, {calculateAge(dog.birthday)}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn sx={{ mr: 1, color: '#718096' }} />
                <Typography variant="h6" sx={{ color: '#718096' }}>
                  {dog.shelter}, {dog.city}, {dog.state}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Chip label={dog.species} size="large" />
                <Chip label={`${dog.weightInPounds} lbs`} size="large" />
                <Chip label={dog.color} size="large" />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                About {dog.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                {dog.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#718096' }}>
                    Birthday
                  </Typography>
                  <Typography variant="body1">
                    {new Date(dog.birthday).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#718096' }}>
                    Shelter Entry
                  </Typography>
                  <Typography variant="body1">
                    {new Date(dog.shelterEntryDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  const subject = `Interested in adopting ${dog.name}`;
                  const body = `Hi, I'm interested in learning more about ${dog.name} for adoption. Please contact me with more information.`;
                  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                }}
                sx={{
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2b' },
                  py: 2,
                  px: 4
                }}
              >
                Contact Shelter
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}