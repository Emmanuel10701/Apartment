"use client";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Footer from "./components/Footer/page";
import SearchNavbar from './components/filters/page'; // Adjust this path
import { FaMap, FaSatellite, FaMountain } from 'react-icons/fa';
import Apartment from './components/card/page'; // Adjust this path

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
  // Add more apartments as needed
];

const MapComponent: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [filteredApartments, setFilteredApartments] = useState(apartments);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (search: string) => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = apartments.filter(apartment =>
      apartment.name.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredApartments(filtered);
  };

  const handlePriceFilter = (min: number, max: number) => {
    const filtered = apartments.filter(apartment =>
      apartment.minPrice >= min && apartment.minPrice <= max
    );
    setFilteredApartments(filtered);
  };

  const handleRentalTypeChange = (type: string) => {
    const filtered = apartments.filter(apartment =>
      apartment.rentalType === type
    );
    setFilteredApartments(filtered);
  };

  const handleSortChange = (order: string) => {
    const sorted = [...filteredApartments].sort((a, b) =>
      order === 'ascending' ? a.minPrice - b.minPrice : b.minPrice - a.minPrice
    );
    setFilteredApartments(sorted);
  };

  const handleStarRatingChange = (rating: number) => {
    const filtered = apartments.filter(apartment =>
      apartment.starRating >= rating
    );
    setFilteredApartments(filtered);
  };

  const handlePropertyTypeChange = (type: string) => {
    const filtered = apartments.filter(apartment =>
      apartment.propertyType === type
    );
    setFilteredApartments(filtered);
  };

  const clearSearch = () => {
    setSearchValue('');
    setFilteredApartments(apartments); // Reset to original apartments
  };

  const setMapType = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

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

  return (
    <div>
      <SearchNavbar 
        onSearch={handleSearch}
        onPriceFilter={handlePriceFilter}
        onRentalTypeChange={handleRentalTypeChange}
        onSortChange={handleSortChange}
        onStarRatingChange={handleStarRatingChange}
        onPropertyTypeChange={handlePropertyTypeChange}
      />
      <div className="flex h-screen">
        <div className=" w-2/3  fixed top-0 left-0 right-0 bottom-0 z-0">
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

          <div className="absolute bottom-10 left-4 p-2 flex gap-2 bg-white shadow-lg rounded-lg z-10">
            <Button variant="contained" color="primary" onClick={() => setMapType(google.maps.MapTypeId.TERRAIN)}>
              <FaMountain className="mr-1" /> Terrain
            </Button>
            <Button variant="contained" color="primary" onClick={() => setMapType(google.maps.MapTypeId.SATELLITE)}>
              <FaSatellite className="mr-1" /> Satellite
            </Button>
            <Button variant="contained" color="secondary" onClick={clearSearch}>
              Clear
            </Button>
          </div>
        </div>
        <div className="w-1/3 p-4 fixed  top-16 right-0 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Available Apartments</h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredApartments.map((apartment) => (
              <Apartment key={apartment.id} {...apartment} />
            ))}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
