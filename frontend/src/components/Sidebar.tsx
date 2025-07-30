// Enhanced Sidebar.tsx with improved accessibility
import React, { useState } from 'react';
import { 
  Box, List, ListItem, ListItemIcon, ListItemText, Typography, 
  Divider, Avatar, Button, Drawer, IconButton, useMediaQuery, useTheme 
} from '@mui/material';
import { 
  Home, Favorite, GridView, Add, Pets, Person, Logout, Menu, Close
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Discover', icon: <Home />, path: '/', ariaLabel: 'Go to discover page' },
    { text: 'Favorites', icon: <Favorite />, path: '/favorites', ariaLabel: 'View your favorite dogs' },
    { text: 'Browse', icon: <GridView />, path: '/browse', ariaLabel: 'Browse all dogs' },
    { text: 'Add Dog', icon: <Add />, path: '/add', ariaLabel: 'Add a new dog' },
  ];

  const displayName = user?.given_name || user?.username || 'User';

  const SidebarContent = () => (
    <Box 
      component="nav"
      aria-label="Main navigation"
      sx={{
        width: 240,
        height: '100%',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Pets sx={{ color: 'white', fontSize: 40, mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
          PupperSpot
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
          Find your perfect companion
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {user && (
        <>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              alt={displayName}
              sx={{ 
                width: 56, 
                height: 56, 
                mx: 'auto', 
                mb: 1.5,
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Person sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {user.email}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        </>
      )}

      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => isMobile && setMobileOpen(false)}
            aria-label={item.ariaLabel}
            aria-current={location.pathname === item.path ? 'page' : undefined}
            sx={{
              borderRadius: 3,
              mb: 1,
              backgroundColor: location.pathname === item.path 
                ? 'rgba(255,255,255,0.2)' 
                : 'transparent',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                transform: 'translateX(8px)'
              },
              '&:focus-visible': {
                outline: '2px solid white',
                outlineOffset: '2px'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 45 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>

      {onSignOut && (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Logout />}
              onClick={onSignOut}
              aria-label="Sign out of your account"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                '&:focus-visible': {
                  outline: '2px solid white',
                  outlineOffset: '2px'
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

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)'
            },
            '&:focus-visible': {
              outline: '2px solid #667eea',
              outlineOffset: '2px'
            }
          }}
        >
          <Menu />
        </IconButton>
        
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ position: 'relative', height: '100%' }}>
            <IconButton
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                color: 'white',
                '&:focus-visible': {
                  outline: '2px solid white',
                  outlineOffset: '2px'
                }
              }}
            >
              <Close />
            </IconButton>
            <SidebarContent />
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      zIndex: 1200
    }}>
      <SidebarContent />
    </Box>
  );
}
