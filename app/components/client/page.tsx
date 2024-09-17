'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, Button, Typography } from '@mui/material';

// Mock apartments data
const apartments = [
  {
    id: 1,
    name: 'Luxury Apartment',
    address: '123 Luxury St, Chicago, IL 60601',
    price: '$2,500/month',
    lat: 41.8801,
    lng: -87.6308,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Modern Condo',
    address: '456 Modern Ave, Chicago, IL 60602',
    price: '$1,800/month',
    lat: 41.8765,
    lng: -87.6290,
    image: 'https://via.placeholder.com/150',
  },
];

const GoogleMapsPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'quarterly',
        libraries: ['places'], // Ensure 'places' library is included
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = (await loader.importLibrary('marker')) as google.maps.MarkerLibrary;

      const locationInMap = {
        lat: 41.8781,
        lng: -87.6298,
      };

      const options: google.maps.MapOptions = {
        center: locationInMap,
        zoom: 12,
        mapId: 'NEXT_MAPS_TUTS',
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);

      // Add the markers in the map
      apartments.forEach((apartment) => {
        new Marker({
          map: map,
          position: { lat: apartment.lat, lng: apartment.lng },
          title: apartment.name,
        });
      });

      setMap(map);
    };

    initializeMap();
  }, []);

  const handleMapTypeChange = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" position="relative">
      <Box flex={1} ref={mapRef} className="h-full" />
      <Box position="absolute" top={16} left={16} zIndex={1000} bgcolor="white" p={2} borderRadius={1} boxShadow={3}>
        <Typography variant="h6" gutterBottom>Map Controls</Typography>
        <Button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.ROADMAP)}
          variant="contained"
          color="primary"
          className="mb-2"
        >
          Roadmap
        </Button>
        <Button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.SATELLITE)}
          variant="contained"
          color="primary"
          className="mb-2"
        >
          Satellite
        </Button>
        <Button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.TERRAIN)}
          variant="contained"
          color="primary"
        >
          Terrain
        </Button>
      </Box>
    </Box>
  );
};

export default GoogleMapsPage;
