import React from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { Favorite, Close, LocationOn, Cake } from '@mui/icons-material';

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
  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <Box sx={{ position: 'relative', mb: 8 }}>
      <Box sx={{
        position: 'relative',
        width: '90vw',
        maxWidth: '400px',
        height: '70vh',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        mx: 'auto'
      }}>
        {/* Image */}
        <Box
          component="img"
          src={dog.photo}
          alt={dog.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        
        {/* Gradient overlay */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          zIndex: 1
        }} />
        
        {/* Dog info */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          pb: 5,
          color: 'white',
          zIndex: 2
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {dog.name}, {calculateAge(dog.birthday)}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body1">
              {dog.city}, {dog.state}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={dog.species} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label={`${dog.weightInPounds} lbs`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label={dog.color} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Box>
          
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {dog.description}
          </Typography>
        </Box>
      </Box>
      
      {/* Action buttons */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        mt: 3
      }}>
        <IconButton
          onClick={onDislike}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: 'white',
            border: '3px solid #ff4458',
            boxShadow: '0 4px 12px rgba(255, 68, 88, 0.3)',
            '&:hover': { 
              backgroundColor: '#ff4458', 
              color: 'white',
              transform: 'scale(1.1)'
            }
          }}
        >
          <Close sx={{ fontSize: 30, color: '#ff4458' }} />
        </IconButton>
        
        <IconButton
          onClick={onLike}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: 'white',
            border: '3px solid #ff6b35',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            '&:hover': { 
              backgroundColor: '#ff6b35', 
              color: 'white',
              transform: 'scale(1.1)'
            }
          }}
        >
          <Favorite sx={{ fontSize: 30, color: '#ff6b35' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
