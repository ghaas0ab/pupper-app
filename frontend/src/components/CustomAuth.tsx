// src/components/CustomAuth.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, TextField, Button, Typography, Paper, 
  InputAdornment, IconButton, Alert, CircularProgress 
} from '@mui/material';
import { 
  Person, Lock, Visibility, VisibilityOff, 
  Pets, Email, Phone 
} from '@mui/icons-material';
import { signIn, signUp, confirmSignUp, getCurrentUser } from 'aws-amplify/auth';

interface CustomAuthProps {
  onAuthSuccess: (user: any) => void;
}

export default function CustomAuth({ onAuthSuccess }: CustomAuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'confirm'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    confirmationCode: ''
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn({ username: formData.username, password: formData.password });
      const user = await getCurrentUser();
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await signUp({
        username: formData.username,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName,
            family_name: formData.lastName
          }
        }
      });
      setMode('confirm');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    }
    setLoading(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await confirmSignUp({
        username: formData.username,
        confirmationCode: formData.confirmationCode
      });
      await signIn({ username: formData.username, password: formData.password });
      const user = await getCurrentUser();
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Confirmation failed');
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, delay: 0.2 }
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper sx={{
          p: 4,
          borderRadius: 6,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          width: { xs: '90vw', sm: 450 },
          maxWidth: 450
        }}>
          {/* Logo and Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                p: 2,
                display: 'inline-block',
                mb: 2,
                boxShadow: '0 8px 32px rgba(102,126,234,0.3)'
              }}>
                <Pets sx={{ fontSize: 48, color: 'white' }} />
              </Box>
            </motion.div>
            
            <Typography variant="h4" sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              PupperSpot
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              {mode === 'signin' && 'Welcome back! Sign in to continue'}
              {mode === 'signup' && 'Join our community of dog lovers'}
              {mode === 'confirm' && 'Check your email for verification code'}
            </Typography>
          </Box>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'signin' && (
              <motion.div
                key="signin"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSignIn}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>

                  <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
                    Don't have an account?{' '}
                    <Button 
                      variant="text" 
                      onClick={() => setMode('signup')}
                      sx={{ 
                        color: '#667eea', 
                        fontWeight: 600,
                        textTransform: 'none',
                        p: 0,
                        minWidth: 'auto'
                      }}
                    >
                      Sign up
                    </Button>
                  </Typography>
                </Box>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': { borderColor: '#667eea' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': { borderColor: '#667eea' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        }
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSignUp}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>

                  <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
                    Already have an account?{' '}
                    <Button 
                      variant="text" 
                      onClick={() => setMode('signin')}
                      sx={{ 
                        color: '#667eea', 
                        fontWeight: 600,
                        textTransform: 'none',
                        p: 0,
                        minWidth: 'auto'
                      }}
                    >
                      Sign in
                    </Button>
                  </Typography>
                </Box>
              </motion.div>
            )}

            {mode === 'confirm' && (
              <motion.div
                key="confirm"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Verification Code"
                    value={formData.confirmationCode}
                    onChange={handleInputChange('confirmationCode')}
                    placeholder="Enter 6-digit code"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        fontSize: '1.2rem',
                        textAlign: 'center',
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleConfirm}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Account'}
                  </Button>

                  <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
                    Didn't receive the code?{' '}
                    <Button 
                      variant="text" 
                      onClick={() => setMode('signup')}
                      sx={{ 
                        color: '#667eea', 
                        fontWeight: 600,
                        textTransform: 'none',
                        p: 0,
                        minWidth: 'auto'
                      }}
                    >
                      Resend
                    </Button>
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
}
