// GoogleMapsClient.tsx
"use client"; // This makes it a client-side component

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, Button, Typography } from '@mui/material';

const GoogleMapsClient: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const searchBoxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'quarterly',
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
      };

      const mapInstance = new Map(mapRef.current as HTMLDivElement, options);
      setMap(mapInstance);
    };

    initializeMap();
  }, []);

  const handleMapTypeChange = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const handleSearch = useCallback(() => {
    if (searchBoxRef.current && map && window.google) {
      const searchBox = new google.maps.places.SearchBox(searchBoxRef.current);

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (place.geometry?.viewport) {
            bounds.union(place.geometry.viewport);
          } else if (place.geometry?.location) {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }
  }, [map]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box ref={mapRef} flex={1} className="h-full" />

      <Box
        position="absolute"
        top={16}
        right={16}
        zIndex={1000}
        bgcolor="white"
        p={2}
        borderRadius={1}
        boxShadow={3}
      >
        <Typography variant="h6" gutterBottom>
          Map Controls
        </Typography>
        <Button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.ROADMAP)}
          variant="contained"
          color="primary"
        >
          Roadmap
        </Button>
        <Button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.SATELLITE)}
          variant="contained"
          color="primary"
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

        <Box mt={2}>
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="Search by address"
            className="p-2 border rounded"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GoogleMapsClient;
