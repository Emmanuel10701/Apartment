'use client';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { useRef, useState } from 'react';
import Fitler from "../filters/page"

// Center of the map
const center = { lat: 48.8584, lng: 2.2945 };

// Dark mode map style
const darkModeMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#484848' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];

const MapComponent: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'], // Include libraries as needed
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('N/A');
  const [duration, setDuration] = useState<string>('N/A');

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  if (loadError) {
    return <div className="p-4 text-red-500">Failed to load Google Maps. Please check the console for more details.</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }

  const calculateRoute = async () => {
    if (originRef.current && destinationRef.current) {
      const origin = originRef.current.value;
      const destination = destinationRef.current.value;

      if (!origin || !destination) {
        return;
      }

      const directionsService = new google.maps.DirectionsService();

      try {
        const results = await directionsService.route({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        });

        const route = results.routes[0];
        if (route) {
          const leg = route.legs[0];
          if (leg) {
            setDirectionsResponse(results);
            setDistance(leg.distance?.text || 'N/A');
            setDuration(leg.duration?.text || 'N/A');
          }
        }
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance('N/A');
    setDuration('N/A');
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
  };

  const centerMap = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(15);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-gray-900 text-white">
      <div className="absolute inset-0">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: darkModeMapStyle, // Apply dark mode styles
          }}
          onLoad={map => {
            setMap(map);
          }}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="absolute top-4 left-4 p-4 bg-gray-800 shadow-lg rounded-lg z-10">
        <div className="flex gap-2 mb-4">
          <div className="flex-grow">
            <Autocomplete>
              <input
                type="text"
                placeholder="Origin"
                ref={originRef}
                className="p-2 border border-gray-700 bg-gray-900 text-white rounded"
              />
            </Autocomplete>
          </div>
          <div className="flex-grow">
            <Autocomplete>
              <input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
                className="p-2 border border-gray-700 bg-gray-900 text-white rounded"
              />
            </Autocomplete>
          </div>
          <button
            onClick={calculateRoute}
            className="bg-pink-600 text-white p-2 rounded"
          >
            Calculate Route
          </button>
          <button
            onClick={clearRoute}
            className="bg-red-600 text-white p-2 rounded"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-4">
          <span>Distance: {distance}</span>
          <span>Duration: {duration}</span>
          <button
            onClick={centerMap}
            className="bg-blue-600 text-white p-2 rounded"
          >
            Center Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
