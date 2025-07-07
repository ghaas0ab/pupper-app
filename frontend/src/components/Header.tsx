import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Pets as PetsIcon, Search as SearchIcon, Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface HeaderProps {
    onSignOut: () => void;
}

export default function Header({ onSignOut }: HeaderProps) {
    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PetsIcon sx={{ color: '#ff6b35', fontSize: 32 }} />
                    <Typography variant="h5" sx={{
                        background: 'linear-gradient(45deg, #ff6b35, #ff8a65)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold'
                    }}>
                        PupperSpot
                    </Typography>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    <Button startIcon={<SearchIcon />}>Browse</Button>
                    <Button component={Link} to="/add" startIcon={<AddIcon />}>Add a Dog</Button>
                    <Button variant="outlined" onClick={onSignOut}>Sign Out</Button>
                </Box>

                <IconButton sx={{ display: { xs: 'block', md: 'none' } }}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
