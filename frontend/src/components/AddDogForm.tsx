import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, Typography } from '@mui/material';
import { dogService } from '../services/api';

export default function AddDogForm() {
  const [formData, setFormData] = useState({
    name: '', species: '', shelter: '', city: '', state: '',
    description: '', birthday: '', weightInPounds: '', color: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    
    setLoading(true);
    try {
      await dogService.createDog(formData, image);
      setFormData({ name: '', species: '', shelter: '', city: '', state: '', description: '', birthday: '', weightInPounds: '', color: '' });
      setImage(null);
      alert('Dog added successfully!');
    } catch (error) {
      alert('Error adding dog');
    }
    setLoading(false);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" mb={2}>Add New Dog</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <TextField fullWidth margin="normal" label="Species" value={formData.species}
            onChange={(e) => setFormData({...formData, species: e.target.value})} required />
          <TextField fullWidth margin="normal" label="Shelter" value={formData.shelter}
            onChange={(e) => setFormData({...formData, shelter: e.target.value})} required />
          <TextField fullWidth margin="normal" label="City" value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})} required />
          <TextField fullWidth margin="normal" label="State" value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})} required />
          <TextField fullWidth margin="normal" label="Description" value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <TextField fullWidth margin="normal" type="date" label="Birthday" value={formData.birthday}
            onChange={(e) => setFormData({...formData, birthday: e.target.value})} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="normal" type="number" label="Weight (lbs)" value={formData.weightInPounds}
            onChange={(e) => setFormData({...formData, weightInPounds: e.target.value})} />
          <TextField fullWidth margin="normal" label="Color" value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})} />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} 
            style={{ margin: '16px 0' }} required />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? 'Adding...' : 'Add Dog'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
