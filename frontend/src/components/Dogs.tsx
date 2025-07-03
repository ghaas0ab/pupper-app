import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';
import { type Dog } from '../types/Dog';

function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

  useEffect(() => {
    const mockDogs: Dog[] = [
      { id: 1, shelter: "Happy Paws Shelter", city: "Seattle", state: "WA", name: "Buddy", species: "Golden Retriever", shelterEntryDate: "2024-01-15", description: "Friendly and energetic dog.", birthday: "2022-03-10", weightInPounds: 65, color: "Golden", photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" },
      { id: 2, shelter: "City Animal Rescue", city: "Portland", state: "OR", name: "Luna", species: "Border Collie", shelterEntryDate: "2024-02-01", description: "Smart and active dog.", birthday: "2021-07-22", weightInPounds: 45, color: "Black & White", photo: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400" },
      { id: 3, shelter: "Rescue Haven", city: "Denver", state: "CO", name: "Max", species: "German Shepherd", shelterEntryDate: "2024-01-20", description: "Loyal and protective companion.", birthday: "2020-11-05", weightInPounds: 75, color: "Brown & Black", photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400" },
      { id: 4, shelter: "Loving Hearts Shelter", city: "Austin", state: "TX", name: "Bella", species: "Labrador Mix", shelterEntryDate: "2024-02-10", description: "Gentle and loving family dog.", birthday: "2022-01-18", weightInPounds: 55, color: "Chocolate", photo: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400" },
      { id: 5, shelter: "Second Chance Rescue", city: "Phoenix", state: "AZ", name: "Charlie", species: "Beagle", shelterEntryDate: "2024-01-30", description: "Playful and curious dog.", birthday: "2021-09-12", weightInPounds: 35, color: "Tri-color", photo: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400" },
      { id: 6, shelter: "Animal Friends", city: "Miami", state: "FL", name: "Daisy", species: "Pit Bull Mix", shelterEntryDate: "2024-02-05", description: "Sweet and affectionate dog.", birthday: "2020-05-30", weightInPounds: 60, color: "Brindle", photo: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400" },
      { id: 7, shelter: "Hope Animal Shelter", city: "Chicago", state: "IL", name: "Rocky", species: "Husky", shelterEntryDate: "2024-01-25", description: "Energetic and adventurous.", birthday: "2021-12-03", weightInPounds: 70, color: "Gray & White", photo: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400" },
      { id: 8, shelter: "Paws & Hearts", city: "Boston", state: "MA", name: "Molly", species: "Cocker Spaniel", shelterEntryDate: "2024-02-08", description: "Calm and gentle companion.", birthday: "2022-04-15", weightInPounds: 40, color: "Golden", photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400" },
      { id: 9, shelter: "Safe Haven Rescue", city: "Nashville", state: "TN", name: "Zeus", species: "Rottweiler", shelterEntryDate: "2024-01-18", description: "Strong and loyal guardian.", birthday: "2020-08-20", weightInPounds: 85, color: "Black & Tan", photo: "https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=400" },
      { id: 10, shelter: "Forever Friends", city: "San Diego", state: "CA", name: "Rosie", species: "Poodle Mix", shelterEntryDate: "2024-02-12", description: "Intelligent and hypoallergenic.", birthday: "2021-06-08", weightInPounds: 25, color: "Cream", photo: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400" }
  ];

    setDogs(mockDogs);
  }, [bucketName]);

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