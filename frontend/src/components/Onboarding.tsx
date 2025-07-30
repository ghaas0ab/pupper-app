// src/components/Onboarding.tsx
import React, { useState } from 'react';
import { 
  Box, Typography, Button, MobileStepper, 
  Paper, useTheme, IconButton 
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      title: 'Welcome to PupperSpot!',
      description: 'Find your perfect canine companion with our easy-to-use app.',
      image: '🐕',
    },
    {
      title: 'Swipe to Match',
      description: 'Swipe right to like a dog or left to pass. It\'s that simple!',
      image: '👆',
    },
    {
      title: 'View Your Favorites',
      description: 'Check your favorites section to see all the dogs you\'ve liked.',
      image: '❤️',
    },
  ];
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSkip = () => {
    onComplete();
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Paper sx={{
        maxWidth: 400,
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <Box sx={{ position: 'relative' }}>
          <IconButton 
            onClick={handleSkip}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          >
            <Close />
          </IconButton>
          
          <Box sx={{ 
            height: 300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 4
          }}>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Typography variant="h1" sx={{ fontSize: '6rem', textAlign: 'center' }}>
                {steps[activeStep].image}
              </Typography>
            </motion.div>
          </Box>
          
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {steps[activeStep].title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              {steps[activeStep].description}
            </Typography>
            
            <MobileStepper
              variant="dots"
              steps={steps.length}
              position="static"
              activeStep={activeStep}
              sx={{ 
                background: 'transparent', 
                '& .MuiMobileStepper-dot': { 
                  backgroundColor: 'rgba(0,0,0,0.2)' 
                },
                '& .MuiMobileStepper-dotActive': { 
                  backgroundColor: '#667eea' 
                }
              }}
              nextButton={
                <Button 
                  size="small" 
                  onClick={handleNext}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                    }
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button 
                  size="small" 
                  onClick={handleBack} 
                  disabled={activeStep === 0}
                  sx={{ color: activeStep === 0 ? 'rgba(0,0,0,0.3)' : '#667eea' }}
                >
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
