import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';


export default function SearchFilters() {
    return (
        // Enhanced SearchFilters.tsx
        <Box sx={{
            width: 280,
            p: 3,
            backgroundColor: '#fff',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 100
        }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Find Your Match
            </Typography>

            {/* Quick Filters */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Quick Filters
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Small Dogs', 'Large Dogs', 'Good with Kids', 'Low Energy'].map(filter => (
                        <Chip
                            key={filter}
                            label={filter}
                            clickable
                            size="small"
                            sx={{ borderRadius: 2 }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Advanced Filters */}
            <Accordion>
                <AccordionSummary>
                    <Typography>Advanced Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Your existing filters */}
                </AccordionDetails>
            </Accordion>
        </Box>

    );
}
