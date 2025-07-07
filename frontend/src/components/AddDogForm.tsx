import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Box, Typography, Container, Paper, Divider, Alert } from '@mui/material';
import { CloudUpload, Pets } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dogService } from '../services/api';

export default function AddDogForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shelter: '', city: '', state: '', name: '', species: '', 
    shelterEntryDate: '', description: '', birthday: '', weightInPounds: '', color: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please select a photo');
      return;
    }
    
    setLoading(true);
    try {
      await dogService.createDog(formData, image);
      setFormData({ shelter: '', city: '', state: '', name: '', species: '', shelterEntryDate: '', description: '', birthday: '', weightInPounds: '', color: '' });
      setImage(null);
      setSuccessMessage('Dog added successfully! 🎉');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error adding dog. Please check console for details.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 12 }}>
      <Container maxWidth="lg">
        {successMessage && (
          <Alert severity="success" sx={{ mb: 4, fontSize: '16px' }}>
            {successMessage}
          </Alert>
        )}
        
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Pets sx={{ fontSize: 48, color: '#ff6b35', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
            Help a Dog Find Their Forever Home
          </Typography>
          <Typography variant="h6" sx={{ color: '#718096', maxWidth: '600px', mx: 'auto' }}>
            Fill out the details below to list a dog for adoption
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ p: 4, backgroundColor: '#fff' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#2d3748' }}>
                🏠 Shelter Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 3 }}>
                <TextField 
                  fullWidth 
                  label="Shelter Name" 
                  placeholder="Arlington Shelter" 
                  value={formData.shelter} 
                  onChange={(e) => setFormData({...formData, shelter: e.target.value})} 
                  required 
                />
                <TextField 
                  fullWidth 
                  label="City" 
                  placeholder="Arlington" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  required 
                />
                <TextField 
                  fullWidth 
                  label="State" 
                  placeholder="VA" 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})} 
                  required 
                />
              </Box>
              <TextField 
                fullWidth 
                type="date" 
                label="Shelter Entry Date" 
                value={formData.shelterEntryDate}
                onChange={(e) => setFormData({...formData, shelterEntryDate: e.target.value})} 
                InputLabelProps={{ shrink: true }} 
                required 
                sx={{ mt: 3 }}
              />
            </Box>

            <Divider />

            <Box sx={{ p: 4, backgroundColor: '#fff' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#2d3748' }}>
                🐕 Dog Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <TextField 
                  fullWidth 
                  label="Dog Name" 
                  placeholder="Fido" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
                <TextField 
                  fullWidth 
                  label="Breed" 
                  placeholder="Labrador Retriever" 
                  value={formData.species}
                  onChange={(e) => setFormData({...formData, species: e.target.value})} 
                  required 
                />
              </Box>
              
              <TextField 
                fullWidth 
                multiline 
                rows={4} 
                label="Description" 
                placeholder="Good boy" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                sx={{ mb: 3 }} 
                required 
              />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                <TextField 
                  fullWidth 
                  type="date" 
                  label="Birthday" 
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})} 
                  InputLabelProps={{ shrink: true }} 
                  required 
                />
                <TextField 
                  fullWidth 
                  type="number" 
                  label="Weight (lbs)" 
                  placeholder="32" 
                  value={formData.weightInPounds}
                  onChange={(e) => setFormData({...formData, weightInPounds: e.target.value})} 
                  required 
                />
                <TextField 
                  fullWidth 
                  label="Color" 
                  placeholder="Brown" 
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})} 
                  required 
                />
              </Box>
            </Box>

            <Divider />

            <Box sx={{ p: 4, backgroundColor: '#f8fafc' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#2d3748' }}>
                📸 Dog Photo
              </Typography>
              <Box sx={{ 
                border: '3px dashed #cbd5e0', 
                borderRadius: 3, 
                p: 6, 
                textAlign: 'center',
                backgroundColor: '#fff',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#ff6b35', backgroundColor: '#fff5f0' }
              }}>
                <CloudUpload sx={{ fontSize: 48, color: '#a0aec0', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: '#4a5568' }}>
                  Upload a beautiful photo of the dog
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
                  Supports PNG, JPEG, JPG files
                </Typography>
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/jpg" 
                  onChange={(e) => setImage(e.target.files?.[0] || null)} 
                  style={{ 
                    padding: '12px 24px', 
                    border: '2px solid #ff6b35', 
                    borderRadius: '8px',
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }} 
                  required 
                />
                {image && (
                  <Typography variant="body2" sx={{ mt: 2, color: '#38a169', fontWeight: 'bold' }}>
                    ✓ {image.name} selected
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ p: 4, backgroundColor: '#fff', textAlign: 'center' }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ 
                  py: 2, 
                  px: 6,
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  borderRadius: 3, 
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2b' }
                }}
              >
                {loading ? 'Adding Dog...' : '🎉 Add Dog for Adoption'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
