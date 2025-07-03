import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';
import { type Dog } from '../types/Dog';
import { dogService } from '../services/api';



function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

  useEffect(() => {
  const fetchDogs = async () => {
    try {
      const data = await dogService.getAllDogs();
      setDogs(data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
      // Fallback to mock data
      const mockDogs: Dog[] = [
        { id: 1, shelter: "Happy Paws Shelter", city: "Seattle", state: "WA", name: "Buddy", species: "Golden Retriever", shelterEntryDate: "2024-01-15", description: "Friendly and energetic dog.", birthday: "2022-03-10", weightInPounds: 65, color: "Golden", photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" },
        { id: 2, shelter: "City Animal Rescue", city: "Portland", state: "OR", name: "Luna", species: "Border Collie", shelterEntryDate: "2024-02-01", description: "Smart and active dog.", birthday: "2021-07-22", weightInPounds: 45, color: "Black & White", photo: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400" }
      ];
      setDogs(mockDogs);
    }
  };
  fetchDogs();
}, []);

  return (
    <Box sx={{ padding: 2, marginTop: 8 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>Available Dogs</Typography>
      <Grid container spacing={3}>
        {dogs.map((dog) => (
          <Grid item xs={12} sm={6} md={4} key={dog.id}>
            <Card>
              <CardMedia component="img" height="200" image={dog.photo} alt={dog.name} />
              <CardContent>
                <Typography variant="h5">{dog.name}</Typography>
                <Typography variant="body2" color="text.secondary">{dog.species}</Typography>
                <Typography variant="body2"><strong>Shelter:</strong> {dog.shelter}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {dog.city}, {dog.state}</Typography>
                <Typography variant="body2"><strong>Weight:</strong> {dog.weightInPounds} lbs</Typography>
                <Typography variant="body2"><strong>Color:</strong> {dog.color}</Typography>
                <Typography variant="body2"><strong>Entry Date:</strong> {dog.shelterEntryDate}</Typography>
                <Typography variant="body2"><strong>Birthday:</strong> {dog.birthday}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{dog.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dogs;