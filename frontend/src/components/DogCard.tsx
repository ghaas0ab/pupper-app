import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Box, Button } from '@mui/material';

interface DogCardProps {
  dog: {
    id: string;
    name: string;
    species: string;
    city: string;
    state: string;
    photo: string;
    weightInPounds: number;
    color: string;
  };
}

export default function DogCard({ dog }: DogCardProps) {
  return (
    <Card sx={{ 
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { 
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="240" image={dog.photo} />
        <Chip 
          label="Available" 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12,
            backgroundColor: '#4caf50',
            color: 'white'
          }} 
        />
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {dog.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {dog.species} • {dog.city}, {dog.state}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={`${dog.weightInPounds} lbs`} size="small" variant="outlined" />
            <Chip label={dog.color} size="small" variant="outlined" />
          </Box>
          <Button variant="contained" sx={{ borderRadius: 3 }}>
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
