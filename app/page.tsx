'use client';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

// Center of the map
const center = { lat: 48.8584, lng: 2.2945 };

// Component for displaying the map and directions
const MapComponent: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places', 'drawing'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('N/A');
  const [duration, setDuration] = useState<string>('N/A');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  if (loadError) {
    return <div className="p-4 text-red-500">Failed to load Google Maps. Please check the console for more details.</div>;
  }

  if (!isLoaded) {
    return (
      <div className="p-4 flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  const calculateRoute = async () => {
    if (originRef.current && destinationRef.current) {
      const origin = originRef.current.value;
      const destination = destinationRef.current.value;

      if (!origin || !destination) {
        return;
      }

      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance('N/A');
    setDuration('N/A');
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
    // Clear drawings
    if (drawingManager) {
      drawingManager.setMap(null);
      setDrawingManager(null);
    }
  };

  const centerMap = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(15);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true); // Start loading when fetching the current location
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation(new google.maps.LatLng(lat, lng));
        map?.panTo({ lat, lng });
        setLoading(false); // Stop loading after location is found
      }, () => {
        // Handle geolocation error
        setLoading(false); // Stop loading on error
      });
    }
  };

  const toggleDrawing = () => {
    if (drawingManager) {
      drawingManager.setMap(null);
      setDrawingManager(null);
    } else {
      const newDrawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        markerOptions: {
          icon: {
            url: '/your-icon-url.png', // Customize your marker icon
            scaledSize: new google.maps.Size(30, 30),
          },
        },
        circleOptions: {
          fillColor: '#FF0000',
          fillOpacity: 0.5,
          strokeWeight: 2,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
        polygonOptions: {
          fillColor: '#00FF00',
          fillOpacity: 0.5,
          strokeWeight: 2,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
        polylineOptions: {
          strokeColor: '#0000FF',
          strokeWeight: 2,
        },
        rectangleOptions: {
          fillColor: '#FFFF00',
          fillOpacity: 0.5,
          strokeWeight: 2,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
      });
      newDrawingManager.setMap(map);
      setDrawingManager(newDrawingManager);
    }
  };

  const setMapType = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute inset-0">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          }}
          onLoad={(map) => {
            setMap(map);
          }}
        >
          <Marker position={center} />
          {currentLocation && <Marker position={currentLocation.toJSON()} icon={{ url: '/current-location-icon.png' }} />}
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>
      <div className="absolute top-4 left-4 p-4 bg-white shadow-lg rounded-lg z-10">
        <div className="flex gap-2 mb-4">
          <div className="flex-grow">
            <Autocomplete>
              <input
                type="text"
                placeholder="Origin"
                ref={originRef}
                className="p-2 border border-gray-300 rounded"
              />
            </Autocomplete>
          </div>
          <div className="flex-grow">
            <Autocomplete>
              <input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
                className="p-2 border border-gray-300 rounded"
              />
            </Autocomplete>
          </div>
          <Button variant="contained" color="primary" onClick={calculateRoute} disabled={loading}>
            Calculate Route
          </Button>
          <Button variant="contained" color="secondary" onClick={clearRoute}>
            Clear
          </Button>
          <Button variant="contained" color="primary" onClick={handleLocationClick}>
            Current Location
          </Button>
          <Button variant="contained" color="info" onClick={toggleDrawing}>
            {drawingManager ? 'Disable Drawing' : 'Enable Drawing'}
          </Button>
          <Button variant="contained" color="info" onClick={() => setMapType(google.maps.MapTypeId.TERRAIN)}>
            Terrain
          </Button>
          <Button variant="contained" color="info" onClick={() => setMapType(google.maps.MapTypeId.SATELLITE)}>
            Satellite
          </Button>
        </div>
        <div className="flex gap-4">
          <span>Distance: {distance}</span>
          <span>Duration: {duration}</span>
          <Button variant="contained" color="primary" onClick={centerMap}>
            Center Map
          </Button>
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
