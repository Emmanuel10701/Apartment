// components/MapComponent.tsx

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { GeoSearchControl, OpenStreetMapProvider } from 'react-geosearch';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-geosearch/dist/react-geosearch.css';
import L from 'leaflet';

// Dynamically import Leaflet components to avoid SSR issues
const LeafletMap = dynamic(() => import('react-leaflet'), { ssr: false });

// Component to update the map's view
const MapUpdater = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const MapComponent = () => {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default position

  return (
    <div className="relative w-full h-screen">
      <MapContainer center={position} zoom={13} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater position={position} />
        <Marker position={position}>
          <Popup>Current location</Popup>
        </Marker>
        <GeoSearchControl
          provider={new OpenStreetMapProvider()}
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          onChange={(result) => setPosition([result.y, result.x])}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
