import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Avatar, Button } from '@mui/material';
import { 
  Home, 
  Favorite, 
  GridView, 
  Add,
  Pets,
  Person,
  Logout
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  user?: {
    username?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
  };
  onSignOut?: () => void;
}

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Favorites', icon: <Favorite />, path: '/favorites' },
    { text: 'Browse Labrador', icon: <GridView />, path: '/browse' },
    { text: 'Add Dog', icon: <Add />, path: '/add' },
  ];

  const displayName = user?.given_name || user?.username || 'User';

  return (
    <Box sx={{
      width: 240,
      height: '100vh',
      backgroundColor: '#fff',
      borderRight: '1px solid #e2e8f0',
      position: 'fixed',
      left: 0,
      top: 0,
      pt: 8,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Pets sx={{ color: '#ff6b35', fontSize: 32, mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2d3748' }}>
          PupperSpot
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      {user && (
        <>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Avatar sx={{ 
              width: 48, 
              height: 48, 
              mx: 'auto', 
              mb: 1,
              backgroundColor: '#ff6b35'
            }}>
              <Person />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2d3748' }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              {user.email}
            </Typography>
          </Box>
          <Divider />
        </>
      )}

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor: location.pathname === item.path ? '#fff5f0' : 'transparent',
              color: location.pathname === item.path ? '#ff6b35' : '#4a5568',
              '&:hover': {
                backgroundColor: '#f7fafc',
                color: '#ff6b35'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      {onSignOut && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Logout />}
              onClick={onSignOut}
              sx={{
                borderColor: '#e2e8f0',
                color: '#4a5568',
                '&:hover': {
                  borderColor: '#ff6b35',
                  backgroundColor: '#fff5f0',
                  color: '#ff6b35'
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
