import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';

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
  const [loading, setLoading] = useState(true);
  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  
  useEffect(() => {
    // Dog details matching your DynamoDB data
    const dogDetails: DogDetails[] = [
      { id: "1", name: "Buddy", species: "Golden Retriever", shelter: "Happy Paws Shelter", city: "Seattle", state: "WA", description: "Friendly and energetic dog.", birthday: "2022-03-10", weightInPounds: 65, color: "Golden", photo: "buddy.jpg", shelterEntryDate: "2024-01-15" },
      { id: "2", name: "Luna", species: "Border Collie", shelter: "City Animal Rescue", city: "Portland", state: "OR", description: "Smart and active dog.", birthday: "2021-07-22", weightInPounds: 45, color: "Black & White", photo: "luna.jpg", shelterEntryDate: "2024-02-01" },
      { id: "3", name: "Max", species: "German Shepherd", shelter: "Rescue Haven", city: "Denver", state: "CO", description: "Loyal and protective companion.", birthday: "2020-11-05", weightInPounds: 75, color: "Brown & Black", photo: "max.jpg", shelterEntryDate: "2024-01-20" },
      { id: "4", name: "Bella", species: "Labrador Mix", shelter: "Loving Hearts Shelter", city: "Austin", state: "TX", description: "Gentle and loving family dog.", birthday: "2022-01-18", weightInPounds: 55, color: "Chocolate", photo: "bella.jpg", shelterEntryDate: "2024-02-10" },
      { id: "5", name: "Charlie", species: "Beagle", shelter: "Second Chance Rescue", city: "Phoenix", state: "AZ", description: "Playful and curious dog.", birthday: "2021-09-12", weightInPounds: 35, color: "Tri-color", photo: "charlie.jpg", shelterEntryDate: "2024-01-30" },
      { id: "6", name: "Daisy", species: "Pit Bull Mix", shelter: "Animal Friends", city: "Miami", state: "FL", description: "Sweet and affectionate dog.", birthday: "2020-05-30", weightInPounds: 60, color: "Brindle", photo: "daisy.jpg", shelterEntryDate: "2024-02-05" },
      { id: "7", name: "Rocky", species: "Husky", shelter: "Hope Animal Shelter", city: "Chicago", state: "IL", description: "Energetic and adventurous.", birthday: "2021-12-03", weightInPounds: 70, color: "Gray & White", photo: "rocky.jpg", shelterEntryDate: "2024-01-25" },
      { id: "8", name: "Molly", species: "Cocker Spaniel", shelter: "Paws & Hearts", city: "Boston", state: "MA", description: "Calm and gentle companion.", birthday: "2022-04-15", weightInPounds: 40, color: "Golden", photo: "molly.jpg", shelterEntryDate: "2024-02-08" },
      { id: "9", name: "Zeus", species: "Rottweiler", shelter: "Safe Haven Rescue", city: "Nashville", state: "TN", description: "Strong and loyal guardian.", birthday: "2020-08-20", weightInPounds: 85, color: "Black & Tan", photo: "zeus.jpg", shelterEntryDate: "2024-01-18" },
      { id: "10", name: "Rosie", species: "Poodle Mix", shelter: "Forever Friends", city: "San Diego", state: "CA", description: "Intelligent and hypoallergenic.", birthday: "2021-06-08", weightInPounds: 25, color: "Cream", photo: "rosie.jpg", shelterEntryDate: "2024-02-12" }
    ];
    
    // Add full S3 URLs to the photos
    const dogsWithUrls = dogDetails.map(dog => ({
      ...dog,
      photo: `https://${bucketName}.s3.amazonaws.com/${dog.photo}`
    }));
    
    setDogs(dogsWithUrls);
    setLoading(false);
  }, [bucketName]);

  if (loading) {
    return <Typography>Loading dogs...</Typography>;
  }

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
