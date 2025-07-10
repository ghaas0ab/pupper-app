import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, Chip, IconButton, Skeleton } from '@mui/material';
import { LocationOn, Favorite, Close, Pets } from '@mui/icons-material';
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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const likedDogs = await dogService.getLikedDogs();
                setFavorites(likedDogs);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setFavorites([]);
            } finally {
                setLoading(false);
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
            await dogService.recordInteraction(dogId, 'DISLIKE');
            setFavorites(prev => prev.filter(dog => dog.id !== dogId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const LoadingSkeleton = () => (
        <Grid container spacing={3}>
            {[...Array(8)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ borderRadius: 4, overflow: 'hidden', height: 420 }}>
                        <Skeleton variant="rectangular" height={240} />
                        <CardContent>
                            <Skeleton variant="text" height={32} width="80%" />
                            <Skeleton variant="text" height={24} width="60%" />
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Skeleton variant="rounded" width={60} height={24} />
                                <Skeleton variant="rounded" width={50} height={24} />
                                <Skeleton variant="rounded" width={45} height={24} />
                            </Box>
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
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                minHeight: '100vh',
                py: { xs: 2, sm: 4 }
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 5, textAlign: 'center' }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 800, 
                                mb: 2, 
                                background: 'linear-gradient(45deg, #ff6b35, #f093fb)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '2rem', sm: '3rem' }
                            }}
                        >
                            ❤️ Your Favorites
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Dogs that stole your heart
                        </Typography>
                    </Box>

                    {loading ? (
                        <LoadingSkeleton />
                    ) : favorites.length === 0 ? (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 10,
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: 4,
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Pets sx={{ fontSize: 80, color: '#cbd5e0', mb: 3 }} />
                            <Typography variant="h4" sx={{ color: '#475569', mb: 2, fontWeight: 600 }}>
                                No favorites yet
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#64748b' }}>
                                Start swiping to add dogs to your favorites!
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {favorites.map((dog) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                                    <Card sx={{
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        height: 420,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        '&:hover': { 
                                            transform: 'translateY(-12px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <IconButton
                                            onClick={() => removeFavorite(dog.id)}
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                zIndex: 2,
                                                width: 40,
                                                height: 40,
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: '#ff4458',
                                                    color: 'white',
                                                    transform: 'scale(1.1)'
                                                }
                                            }}
                                        >
                                            <Close sx={{ fontSize: 20 }} />
                                        </IconButton>

                                        <CardMedia
                                            component="img"
                                            height="240"
                                            image={dog.thumbnailPhoto || dog.photo}
                                            alt={dog.name}
                                            sx={{
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                            onClick={() => navigate(`/dog/${dog.id}`)}
                                        />

                                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#1e293b' }}>
                                                {dog.name}, {calculateAge(dog.birthday)}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOn sx={{ fontSize: 18, color: '#64748b', mr: 0.5 }} />
                                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
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
                                                    color: '#475569',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    lineHeight: 1.5
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
