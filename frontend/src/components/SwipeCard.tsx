import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip, Skeleton } from '@mui/material';
import { Favorite, Close, LocationOn, Info } from '@mui/icons-material';

interface Dog {
  id: string;
  name: string;
  species: string;
  city: string;
  state: string;
  photo: string;
  weightInPounds: number;
  color: string;
  description: string;
  birthday: string;
}

interface SwipeCardProps {
  dog: Dog;
  onLike: () => void;
  onDislike: () => void;
}

export default function SwipeCard({ dog, onLike, onDislike }: SwipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      mb: 6,
      maxWidth: { xs: '95vw', sm: '420px' },
      mx: 'auto'
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '75vh', sm: '600px' },
        borderRadius: { xs: 3, sm: 4 },
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)'
        }
      }}>
        {!imageLoaded && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            animation="wave"
          />
        )}
        
        <Box
          component="img"
          src={dog.photo}
          alt={dog.name}
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: imageLoaded ? 'block' : 'none'
          }}
        />
        
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
          zIndex: 1
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2.5, sm: 3.5 },
          color: 'white',
          zIndex: 2
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 1.5,
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {dog.name}, {calculateAge(dog.birthday)}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <LocationOn sx={{ mr: 1, fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
              {dog.city}, {dog.state}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
            <Chip 
              label={dog.species} 
              size="medium"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.25)', 
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }} 
            />
            <Chip 
              label={`${dog.weightInPounds} lbs`} 
              size="medium"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.25)', 
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }} 
            />
            <Chip 
              label={dog.color} 
              size="medium"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.25)', 
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }} 
            />
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.95,
              lineHeight: 1.6,
              fontSize: '0.95rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {dog.description}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: 3, sm: 5 },
        mt: 4
      }}>
        <IconButton
          onClick={onDislike}
          sx={{
            width: { xs: 65, sm: 75 },
            height: { xs: 65, sm: 75 },
            backgroundColor: 'white',
            border: '4px solid #ff4458',
            boxShadow: '0 8px 25px rgba(255, 68, 88, 0.25)',
            transition: 'all 0.3s ease',
            '&:hover': { 
              backgroundColor: '#ff4458', 
              transform: 'scale(1.15)',
              boxShadow: '0 12px 35px rgba(255, 68, 88, 0.4)'
            }
          }}
        >
          <Close sx={{ fontSize: { xs: 32, sm: 36 }, color: '#ff4458' }} />
        </IconButton>
        
        <IconButton
          onClick={onLike}
          sx={{
            width: { xs: 65, sm: 75 },
            height: { xs: 65, sm: 75 },
            backgroundColor: 'white',
            border: '4px solid #ff6b35',
            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.25)',
            transition: 'all 0.3s ease',
            '&:hover': { 
              backgroundColor: '#ff6b35', 
              transform: 'scale(1.15)',
              boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)'
            }
          }}
        >
          <Favorite sx={{ fontSize: { xs: 32, sm: 36 }, color: '#ff6b35' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
