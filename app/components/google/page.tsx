// ServerComponent.tsx
"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';

// Static apartments data that can be rendered on the server-side
const apartments = [
  {
    id: 1,
    name: 'Luxury Apartment',
    address: '123 Luxury St, Chicago, IL 60601',
    price: '$2,500/month',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Modern Condo',
    address: '456 Modern Ave, Chicago, IL 60602',
    price: '$1,800/month',
    image: 'https://via.placeholder.com/150',
  },
];

const ServerComponent: React.FC = () => {
  return (
    <Box position="absolute" bottom={16} left={16} zIndex={1000} bgcolor="white" p={2} borderRadius={1} boxShadow={3} width="300px" maxHeight="calc(100vh - 64px)" overflow="auto">
      <Typography variant="h6" gutterBottom>
        Available Apartments
      </Typography>
      {apartments.map((apartment) => (
        <Box key={apartment.id} bgcolor="background.paper" mb={2} p={2} borderRadius={1} boxShadow={1}>
          <img
            src={apartment.image}
            alt={apartment.name}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
          <Typography variant="h6">{apartment.name}</Typography>
          <Typography variant="body2" color="textSecondary">{apartment.address}</Typography>
          <Typography variant="body1" color="primary">{apartment.price}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ServerComponent;
