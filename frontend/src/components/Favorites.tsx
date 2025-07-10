import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, Chip, IconButton } from '@mui/material';
import { LocationOn, Favorite, Close } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { dogService } from '../services/api';

interface Dog {
    id: string;
    name: string;
    species: string;
    city: string;
    state: string;
    photo: string;
    thumbnailPhoto?: string;
    weightInPounds: number;
    color: string;
    description: string;
    birthday: string;
}

interface FavoritesProps {
    user?: any;
    signOut?: () => void;
}

export default function Favorites({ user, signOut }: FavoritesProps) {
    const [favorites, setFavorites] = useState<Dog[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const likedDogs = await dogService.getLikedDogs();
                setFavorites(likedDogs);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setFavorites([]);
            }
        };
        fetchFavorites();
    }, []);

    const calculateAge = (birthday: string) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    };

    const removeFavorite = async (dogId: string) => {
        try {
            // Record a DISLIKE to remove from favorites
            await dogService.recordInteraction(dogId, 'DISLIKE');
            // Update local state immediately
            setFavorites(prev => prev.filter(dog => dog.id !== dogId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar user={user} onSignOut={signOut} />
            <Box sx={{
                flex: 1,
                ml: '240px',
                backgroundColor: '#f8fafc',
                minHeight: '100vh',
                py: 4
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
                            ❤️ Your Favorites
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#718096' }}>
                            Dogs you've liked
                        </Typography>
                    </Box>

                    {favorites.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Favorite sx={{ fontSize: 64, color: '#cbd5e0', mb: 2 }} />
                            <Typography variant="h5" sx={{ color: '#4a5568', mb: 1 }}>
                                No favorites yet
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#718096' }}>
                                Start swiping to add dogs to your favorites!
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {favorites.map((dog) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                                    <Card sx={{
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'transform 0.2s',
                                        position: 'relative',
                                        height: 400,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': { transform: 'translateY(-5px)' }
                                    }}>
                                        <IconButton
                                            onClick={() => removeFavorite(dog.id)}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                zIndex: 2,
                                                '&:hover': {
                                                    backgroundColor: '#ff4458',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            <Close sx={{ fontSize: 20 }} />
                                        </IconButton>

                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={dog.thumbnailPhoto || dog.photo}
                                            alt={dog.name}
                                            sx={{
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                width: '100%',
                                                height: '200px'
                                            }}
                                            onClick={() => navigate(`/dog/${dog.id}`)}
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

                                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                <Chip label={dog.species} size="small" />
                                                <Chip label={`${dog.weightInPounds} lbs`} size="small" />
                                                <Chip label={dog.color} size="small" />
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
                    )}
                </Container>
            </Box>
        </Box>
    );
}
