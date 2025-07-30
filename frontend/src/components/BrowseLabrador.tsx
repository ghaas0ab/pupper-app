import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Container, Grid, Card, CardMedia, CardContent, 
  Chip, TextField, InputAdornment, Skeleton, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Button, IconButton
} from '@mui/material';
import { LocationOn, Search, FilterList, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { dogService } from '../services/api';

interface Dog {
  id: string;
  name: string;
  species: string;
  city: string;
  state: string;
  shelter?: string;
  photo: string;
  thumbnailPhoto?: string;
  weightInPounds: number;
  color: string;
  description: string;
  birthday: string;
  shelterEntryDate?: string;
}

interface BrowseLabradorProps {
  user?: any;
  signOut?: () => void;
}

export default function BrowseLabrador({ user, signOut }: BrowseLabradorProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [colorFilter, setColorFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogs = async () => {
      setLoading(true);
      try {
        const fetchedDogs = await dogService.getAllDogs();
        setDogs(fetchedDogs);
        setFilteredDogs(fetchedDogs);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  useEffect(() => {
    const filtered = dogs.filter(dog => {
      // Text search filter
      const matchesSearch = 
        searchTerm === '' || 
        dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Color filter
      const matchesColor = colorFilter === '' || dog.color.toLowerCase() === colorFilter.toLowerCase();
      
      // State filter
      const matchesState = stateFilter === '' || dog.state === stateFilter;
      
      return matchesSearch && matchesColor && matchesState;
    });
    
    setFilteredDogs(filtered);
  }, [searchTerm, colorFilter, stateFilter, dogs]);

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const uniqueColors = [...new Set(dogs.map(dog => dog.color))];
  const uniqueStates = [...new Set(dogs.map(dog => dog.state))];

  const resetFilters = () => {
    setSearchTerm('');
    setColorFilter('');
    setStateFilter('');
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden', height: 350 }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={28} width="70%" />
              <Skeleton variant="text" height={20} width="50%" sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={50} height={24} />
                <Skeleton variant="rounded" width={45} height={24} />
              </Box>
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} width="80%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar user={user} onSignOut={signOut} />
      <Box sx={{
        flex: 1,
        ml: { xs: 0, md: '240px' },
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 }
      }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
              🐕 Browse All Dogs
            </Typography>
            <Typography variant="h6" sx={{ color: '#718096', mb: 3 }}>
              All dogs available for adoption
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 2
            }}>
              <TextField
                fullWidth
                placeholder="Search by name, location, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#718096' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear search"
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  maxWidth: { xs: '100%', sm: 400 }, 
                  backgroundColor: 'white', 
                  borderRadius: 2 
                }}
                aria-label="Search dogs"
              />
              
              <Button
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "contained" : "outlined"}
                sx={{ 
                  minWidth: { xs: '100%', sm: 'auto' },
                  whiteSpace: 'nowrap'
                }}
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>
            
            {showFilters && (
              <Box 
                id="filter-panel"
                sx={{ 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 2, 
                  mb: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  alignItems: { xs: 'stretch', md: 'center' }
                }}
              >
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel id="color-filter-label">Color</InputLabel>
                  <Select
                    labelId="color-filter-label"
                    value={colorFilter}
                    label="Color"
                    onChange={(e) => setColorFilter(e.target.value)}
                  >
                    <MenuItem value="">All Colors</MenuItem>
                    {uniqueColors.map(color => (
                      <MenuItem key={color} value={color}>{color}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel id="state-filter-label">State</InputLabel>
                  <Select
                    labelId="state-filter-label"
                    value={stateFilter}
                    label="State"
                    onChange={(e) => setStateFilter(e.target.value)}
                  >
                    <MenuItem value="">All States</MenuItem>
                    {uniqueStates.map(state => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={resetFilters}
                  startIcon={<Clear />}
                  sx={{ ml: { md: 'auto' } }}
                >
                  Reset Filters
                </Button>
              </Box>
            )}
          </Box>

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <Grid container spacing={3}>
                {filteredDogs.map((dog) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                    <Card sx={{ 
                      borderRadius: 3, 
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
                      },
                      '&:focus-visible': {
                        outline: '2px solid #667eea',
                        outlineOffset: '2px'
                      }
                    }}
                    onClick={() => navigate(`/dog/${dog.id}`)}
                    tabIndex={0}
                    role="link"
                    aria-label={`View details for ${dog.name}, a ${dog.color} ${dog.species}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        navigate(`/dog/${dog.id}`);
                      }
                    }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={dog.thumbnailPhoto || dog.photo}
                        alt={`Photo of ${dog.name}`}
                      />
                      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {dog.name}, {calculateAge(dog.birthday)}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationOn sx={{ fontSize: 16, color: '#718096', mr: 0.5 }} />
                          <Typography variant="body2" sx={{ color: '#718096' }}>
                            {dog.city}, {dog.state}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip 
                            label={dog.species} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              fontWeight: 600
                            }}
                          />
                          <Chip 
                            label={`${dog.weightInPounds} lbs`} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#f0fdf4',
                              color: '#166534',
                              fontWeight: 600
                            }}
                          />
                          <Chip 
                            label={dog.color} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4a5568',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {dog.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {filteredDogs.length === 0 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 10,
                  px: 3,
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Search sx={{ fontSize: 80, color: '#cbd5e0', mb: 3 }} />
                  <Typography variant="h4" sx={{ color: '#475569', mb: 2, fontWeight: 600 }}>
                    No dogs found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 500, mx: 'auto' }}>
                    {searchTerm ? (
                      <>No dogs match your search for "<strong>{searchTerm}</strong>"</>
                    ) : (
                      <>No dogs match your current filters</>
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={resetFilters}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: 3,
                      py: 1.5,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(102,126,234,0.4)'
                      }
                    }}
                  >
                    Reset All Filters
                  </Button>
                </Box>
              )}

              {filteredDogs.length > 0 && (
                <Box sx={{ textAlign: 'center', mt: 6, py: 4, backgroundColor: 'white', borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3748' }}>
                    Total Dogs: {filteredDogs.length}
                  </Typography>
                  {(searchTerm || colorFilter || stateFilter) && (
                    <Typography variant="body1" sx={{ color: '#718096', mt: 1 }}>
                      {searchTerm && <>Search: "{searchTerm}" </>}
                      {colorFilter && <>Color: {colorFilter} </>}
                      {stateFilter && <>State: {stateFilter}</>}
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}
