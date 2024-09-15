"use client";

import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useSWR from 'swr';
import { FaSearch } from 'react-icons/fa'; // For search icon
import { MdZoomIn, MdZoomOut, MdCreate, MdClear } from 'react-icons/md'; // For zoom, draw, and clear icons

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 51.505,
  lng: -0.09,
};

const zoomLevel = 13;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const HomePage: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ ...center });
  const [autocomplete, setAutocomplete] = useState<string>('');
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([center]);
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { data: places } = useSWR(
    autocomplete ? `/api/search?query=${autocomplete}` : null,
    fetcher
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutocomplete(event.target.value);
  };

  const handleSearchSelect = (event: React.ChangeEvent<{}>, value: any) => {
    if (value) {
      const newLocation = { lat: value.lat, lng: value.lng };
      setLocation(newLocation);
      setMarkers((prevMarkers) => [...prevMarkers, newLocation]);
    }
  };

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined) {
        map.setZoom(currentZoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined) {
        map.setZoom(currentZoom - 1);
      }
    }
  };

  const handleDrawingToggle = () => {
    setDrawingMode(!drawingMode);
  };

  const handleClearMarkers = () => {
    setMarkers([]);
    setAutocomplete(''); // Clear search field as well
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen p-4 md:p-10">
      {/* Search Bar */}
      <div className="absolute top-4 right-4 z-10 p-4">
        <Autocomplete
          freeSolo
          options={places?.results || []}
          getOptionLabel={(option: any) => option.name || ''}
          onChange={handleSearchSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a place"
              variant="outlined"
              onChange={handleSearchChange}
              className="w-72 bg-white"
              InputProps={{
                ...params.InputProps,
                startAdornment: <FaSearch className="text-gray-500 ml-2" />, // Search icon
              }}
            />
          )}
        />
      </div>

      {/* Map Container */}
      <div className="relative w-full h-full">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={zoomLevel}
            onLoad={(map) => setMap(map)}
          >
            {markers.map((position, index) => (
              <Marker key={index} position={position} />
            ))}
          </GoogleMap>
        </LoadScript>

        {/* Custom Controls */}
        <div className="absolute top-0 left-0 m-4 z-10 flex flex-col">
          <button onClick={handleZoomIn} className="bg-white p-2 rounded-full shadow-lg mb-2">
            <MdZoomIn size={24} />
          </button>
          <button onClick={handleZoomOut} className="bg-white p-2 rounded-full shadow-lg mb-2">
            <MdZoomOut size={24} />
          </button>
          <button onClick={handleDrawingToggle} className="bg-white p-2 rounded-full shadow-lg mb-2">
            <MdCreate size={24} className={drawingMode ? 'text-blue-500' : 'text-gray-500'} />
          </button>
          <button onClick={handleClearMarkers} className="bg-white p-2 rounded-full shadow-lg">
            <MdClear size={24} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
