import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useSWR from 'swr';

// Define a fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const center: LatLngExpression = [51.505, -0.09]; // Default center
const zoomLevel = 13; // Default zoom level

const HomePage: React.FC = () => {
  const [location, setLocation] = useState<LatLngExpression>(center);
  const [autocomplete, setAutocomplete] = useState<string>('');
  const [markers, setMarkers] = useState<LatLngExpression[]>([center]);

  // Use SWR to fetch autocomplete data
  const { data: places } = useSWR(
    autocomplete ? `/api/search?query=${autocomplete}` : null,
    fetcher
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutocomplete(event.target.value);
  };

  const handleSearchSelect = (event: React.ChangeEvent<{}>, value: any) => {
    if (value) {
      const newLocation: LatLngExpression = [value.lat, value.lng];
      setLocation(newLocation);
      setMarkers((prevMarkers) => [...prevMarkers, newLocation]);
    }
  };

  return (
    <div className="relative h-screen">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow-lg">
        <h1 className="text-lg font-bold">3D Map Title</h1>
      </div>
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
            />
          )}
        />
      </div>
      <MapContainer
        center={location}
        zoom={zoomLevel}
        style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw' }}
        className="z-0"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://stamen.com">Stamen Design</a>'
              opacity={0.5}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Watercolor">
            <TileLayer
              url="https://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://stamen.com">Stamen Design</a>'
              opacity={0.5}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker}>
            <Popup>Marker {index + 1}</Popup>
          </Marker>
        ))}
        {markers.length > 1 && (
          <Polyline positions={markers} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default HomePage;
