import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Container, Card, CardMedia, Chip, Button, 
  Grid, Skeleton, IconButton, useMediaQuery, useTheme 
} from '@mui/material';
import { ArrowBack, LocationOn, Share, Favorite } from '@mui/icons-material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  React.useEffect(() => {
    const fetchDog = async () => {
      try {
        const dogData = await dogService.getDogById(id!);
        setDog(dogData);
      } catch (error) {
        console.error('Error fetching dog:', error);
        setDog(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchDog();
  }, [id]);

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Sidebar user={user} onSignOut={signOut} />
        <Box sx={{ 
          flex: 1, 
          ml: { xs: 0, md: '240px' }, 
          p: { xs: 2, sm: 4 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh'
        }}>
          <Container maxWidth="lg">
            <Skeleton variant="rectangular" width={100} height={40} sx={{ mb: 3 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="text" height={60} width="80%" />
                <Skeleton variant="text" height={40} width="60%" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <Skeleton variant="rounded" width={80} height={32} />
                  <Skeleton variant="rounded" width={70} height={32} />
                  <Skeleton variant="rounded" width={60} height={32} />
                </Box>
                <Skeleton variant="text" height={200} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    );
  }

  if (!dog) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Sidebar user={user} onSignOut={signOut} />
        <Box sx={{ 
          flex: 1, 
          ml: { xs: 0, md: '240px' }, 
          p: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}>
          <Typography variant="h4" sx={{ color: '#64748b' }}>
            Dog not found
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar user={user} onSignOut={signOut} />
      <Box sx={{
        flex: 1,
        ml: { xs: 0, md: '240px' },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        py: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 3
            }}
          >
            Back
          </Button>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                {!imageLoaded && (
                  <Skeleton variant="rectangular" height={500} />
                )}
                <CardMedia
                  component="img"
                  height="500"
                  image={dog.originalPhoto || dog.photo}
                  alt={dog.name}
                  onLoad={() => setImageLoaded(true)}
                  sx={{ 
                    objectFit: 'cover',
                    display: imageLoaded ? 'block' : 'none'
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)'
                    }
                  }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Meet ${dog.name}!`,
                        text: `Check out this adorable ${dog.species} looking for a home!`,
                        url: window.location.href
                      });
                    }
                  }}
                >
                  <Share />
                </IconButton>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: { xs: 3, sm: 4 },
                height: 'fit-content'
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 2,
                    fontSize: { xs: '2rem', sm: '3rem' },
                    background: 'linear-gradient(45deg, #ff6b35, #f093fb)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {dog.name}, {calculateAge(dog.birthday)}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocationOn sx={{ mr: 1, color: '#64748b' }} />
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    {dog.shelter}, {dog.city}, {dog.state}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
                  <Chip 
                    label={dog.species} 
                    size="large"
                    sx={{ 
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  />
                  <Chip 
                    label={`${dog.weightInPounds} lbs`} 
                    size="large"
                    sx={{ 
                      backgroundColor: '#f0fdf4',
                      color: '#166534',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  />
                  <Chip 
                    label={dog.color} 
                    size="large"
                    sx={{ 
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                  About {dog.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: '#475569' }}>
                  {dog.description}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Birthday
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {new Date(dog.birthday).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      Shelter Entry
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {new Date(dog.shelterEntryDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth={isMobile}
                  onClick={() => {
                    const subject = `Interested in adopting ${dog.name}`;
                    const body = `Hi, I'm interested in learning more about ${dog.name} for adoption. Please contact me with more information.`;
                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                  }}
                  sx={{
                    background: 'linear-gradient(45deg, #ff6b35, #f093fb)',
                    py: 2,
                    px: 4,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)'
                    }
                  }}
                >
                  Contact Shelter
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
