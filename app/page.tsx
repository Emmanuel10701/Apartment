"use client";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Footer from "./components/Footer/page"
import Filter from "./components/filters/page"
import { FaMap, FaSatellite, FaMountain } from 'react-icons/fa';
import Apartment from './components/card/page'; // Make sure to adjust this path

const center = { lat: 48.8584, lng: 2.2945 };

const apartments = [
  {
    id: 1,
    name: "Luxury Apartment",
    minPrice: 1500,
    rentalType: "Monthly",
    starRating: 4,
    propertyType: "Apartment",
    images: [
      "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg",
      "https://images.pexels.com/photos/1234568/pexels-photo-1234568.jpeg",
      "https://images.pexels.com/photos/1234569/pexels-photo-1234569.jpeg",
    ],
    phoneNumber: "1234567890",
    email: "luxury@apartment.com",
  },
  {
    id: 2,
    name: "Cozy Studio",
    minPrice: 800,
    rentalType: "Monthly",
    starRating: 5,
    propertyType: "Studio",
    images: [
      "https://images.pexels.com/photos/7654321/pexels-photo-7654321.jpeg",
      "https://images.pexels.com/photos/7654322/pexels-photo-7654322.jpeg",
      "https://images.pexels.com/photos/7654323/pexels-photo-7654323.jpeg",
    ],
    phoneNumber: "0987654321",
    email: "cozy@studio.com",
  },
  {
    id: 2,
    name: "Cozy Studio",
    minPrice: 800,
    rentalType: "Monthly",
    starRating: 5,
    propertyType: "Studio",
    images: [
      "https://images.pexels.com/photos/7654321/pexels-photo-7654321.jpeg",
      "https://images.pexels.com/photos/7654322/pexels-photo-7654322.jpeg",
      "https://images.pexels.com/photos/7654323/pexels-photo-7654323.jpeg",
    ],
    phoneNumber: "0987654321",
    email: "cozy@studio.com",
  },
  {
    id: 2,
    name: "Cozy Studio",
    minPrice: 800,
    rentalType: "Monthly",
    starRating: 5,
    propertyType: "Studio",
    images: [
      "https://images.pexels.com/photos/7654321/pexels-photo-7654321.jpeg",
      "https://images.pexels.com/photos/7654322/pexels-photo-7654322.jpeg",
      "https://images.pexels.com/photos/7654323/pexels-photo-7654323.jpeg",
    ],
    phoneNumber: "0987654321",
    email: "cozy@studio.com",
  },
  {
    id: 3,
    name: "Cozy Studio",
    minPrice: 800,
    rentalType: "Monthly",
    starRating: 5,
    propertyType: "Studio",
    images: [
      "https://images.pexels.com/photos/7654321/pexels-photo-7654321.jpeg",
      "https://images.pexels.com/photos/7654322/pexels-photo-7654322.jpeg",
      "https://images.pexels.com/photos/7654323/pexels-photo-7654323.jpeg",
    ],
    phoneNumber: "0987654321",
    email: "cozy@studio.com",
  },
];

const MapComponent: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const originRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation(new google.maps.LatLng(lat, lng));
        map?.panTo({ lat, lng });
        setLoading(false);
      }, () => {
        setLoading(false);
      });
    }
  };

  const handleSearch = async () => {
    if (searchValue) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchValue }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const location = results[0].geometry.location;
          if (location) {
            map?.panTo(location);
            setCurrentLocation(location);
            setSearchValue(''); // Clear input after search
          }
        } else {
          alert('City or town not found. Please try again.');
        }
      });
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    setCurrentLocation(null); // Clear the current location
  };

  const setMapType = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="relative w-2/3">
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
        </GoogleMap>

        <div className="absolute top-10 left-4 p-2 flex flex-col gap-4 bg-white shadow-lg rounded-lg z-10">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          >
            <input
              type="text"
              placeholder="Search City or Town"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </Autocomplete>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="contained" color="secondary" onClick={clearSearch}>
            Clear
          </Button>
        </div>

        <div className="absolute bottom-10 left-4 p-2 flex gap-2 bg-white shadow-lg rounded-lg z-10">
          <Button variant="contained" color="primary" onClick={() => setMapType(google.maps.MapTypeId.TERRAIN)}>
            <FaMountain className="mr-1" /> Terrain
          </Button>
          <Button variant="contained" color="primary" onClick={() => setMapType(google.maps.MapTypeId.SATELLITE)}>
            <FaSatellite className="mr-1" /> Satellite
          </Button>
        </div>

        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
            <CircularProgress />
          </div>
        )}
      </div>
      <div className="w-1/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Available Apartments</h2>
        <div className="grid grid-cols-1 gap-4">
          {apartments.map((apartment) => (
            <Apartment key={apartment.id} {...apartment} />
          ))}
        </div>
        <Footer/>
      </div>
    </div>
  );
};

export default MapComponent;
