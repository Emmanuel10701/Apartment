// pages/index.tsx

"use client";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Footer from "./components/Footer/page"; // Adjust this path
import SearchNavbar from "./components/filters/page"; // Adjust this path
import ApartmentCard from "./components/card/page"; // Adjust this path
import { FaSatellite, FaMountain } from "react-icons/fa";

const center = { lat: 48.8584, lng: 2.2945 };

interface Apartment {
  id: number;
  name: string;
  minPrice: number;
  rentalType: string;
  starRating: number;
  propertyType: string;
  images: string[];
  phoneNumber: string;
  email: string;
  address: string;
}

const apartments: Apartment[] = [
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
    address: "123 Luxury St, Beverly Hills, CA",
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
    address: "456 Cozy Ave, Seattle, WA",
  },
  // Add more apartments as needed
];

interface SearchFilters {
  search: string;
  minRent?: number;
  maxRent?: number;
  rentalType?: string;
  sortOrder?: string;
  starRating?: number;
  propertyType?: string;
}

const MapComponent: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(apartments);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(true); // Track map visibility

  const geocodeAddress = async (address: string): Promise<google.maps.LatLngLiteral> => {
    const geocoder = new google.maps.Geocoder();
    return new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0].geometry.location) {
          resolve(results[0].geometry.location.toJSON());
        } else {
          reject(new Error("Geocode was not successful for the following reason: " + status));
        }
      });
    });
  };

  const loadApartmentMarkers = async () => {
    try {
      const newMarkers = await Promise.all(
        filteredApartments.map(async (apartment) => {
          try {
            const location = await geocodeAddress(apartment.address);
            return location;
          } catch (error) {
            console.error(`Error geocoding address for ${apartment.name}:`, error);
            return null; // Return null for failed geocodes
          }
        })
      );
      setMarkers(newMarkers.filter(Boolean) as google.maps.LatLngLiteral[]); // Filter out nulls
    } catch (error) {
      console.error("Error loading apartment markers:", error);
    }
  };

  // Call loadApartmentMarkers when filtered apartments change
  useEffect(() => {
    if (filteredApartments.length > 0) {
      loadApartmentMarkers();
    } else {
      setMarkers([]); // Clear markers if no apartments are filtered
    }
  }, [filteredApartments]);

  // Handle search and filters
  const handleSearch = (filters: SearchFilters) => {
    let filtered = apartments;

    // Apply search keyword
    if (filters.search) {
      const lowercasedSearch = filters.search.toLowerCase();
      filtered = filtered.filter(
        (apartment) =>
          apartment.name.toLowerCase().includes(lowercasedSearch) ||
          apartment.address.toLowerCase().includes(lowercasedSearch) ||
          apartment.propertyType.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply rental type filter
    if (filters.rentalType) {
      filtered = filtered.filter(
        (apartment) => apartment.rentalType === filters.rentalType
      );
    }

    // Apply star rating filter
    if (filters.starRating !== undefined && filters.starRating > 0) {
      filtered = filtered.filter(
        (apartment) => apartment.starRating >= filters.starRating!
      );
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(
        (apartment) => apartment.propertyType === filters.propertyType
      );
    }

    // Apply price range filter
    if (filters.minRent !== undefined && filters.maxRent !== undefined) {
      filtered = filtered.filter(
        (apartment) =>
          apartment.minPrice >= filters.minRent! &&
          apartment.minPrice <= filters.maxRent!
      );
    } else if (filters.minRent !== undefined && filters.maxRent === undefined) {
      filtered = filtered.filter((apartment) => apartment.minPrice >= filters.minRent!);
    } else if (filters.minRent === undefined && filters.maxRent !== undefined) {
      filtered = filtered.filter((apartment) => apartment.minPrice <= filters.maxRent!);
    }

    // Apply sorting
    if (filters.sortOrder) {
      filtered = [...filtered].sort((a, b) =>
        filters.sortOrder === "ascending" ? a.minPrice - b.minPrice : b.minPrice - a.minPrice
      );
    }

    setFilteredApartments(filtered);
  };

  const clearSearch = () => {
    setFilteredApartments(apartments); // Reset to original apartments
  };

  const setMapType = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  if (loadError) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load Google Maps. Please check the console for more details.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 flex justify-center mt-40 items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <SearchNavbar onSearch={handleSearch} />
      <div className="flex flex-col md:flex-row h-screen relative">
        {/* Map Section */}
        <div
          className={`md:w-2/3 w-full ${
            isMapVisible ? "block" : "hidden"
          } md:block fixed md:relative top-0 left-0 right-0 bottom-0 z-0`}
        >
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
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
            {markers.map((marker, index) => (
              <Marker key={index} position={marker} />
            ))}
          </GoogleMap>

          {/* Map Controls */}
          <div className="absolute bottom-10 left-4 p-2 flex gap-2 bg-white shadow-lg rounded-lg z-10">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setMapType(google.maps.MapTypeId.TERRAIN)}
            >
              <FaMountain className="mr-1" /> Terrain
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setMapType(google.maps.MapTypeId.SATELLITE)}
            >
              <FaSatellite className="mr-1" /> Satellite
            </Button>
            <Button variant="contained" color="secondary" onClick={clearSearch}>
              Clear
            </Button>
          </div>

          {/* Toggle Button for Small Screens */}
          <div className="absolute top-4 right-4 z-10 md:hidden">
            <Button variant="contained" color="primary" onClick={() => setIsMapVisible(false)}>
              Show Apartments
            </Button>
          </div>
        </div>

        {/* Apartments Section */}
        <div
          className={`md:w-1/3 w-full ${
            isMapVisible ? "hidden" : "block"
          } md:block fixed md:relative top-0 right-0 bottom-0 overflow-y-auto p-4 bg-white z-10`}
        >
          <h2 className="text-xl font-bold mb-4">Available Apartments</h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredApartments.length > 0 ? (
              filteredApartments.map((apartment) => (
                <ApartmentCard key={apartment.id} {...apartment} />
              ))
            ) : (
              <p className="text-gray-500">No apartments found matching your criteria.</p>
            )}
          </div>

          {/* Toggle Button for Small Screens */}
          <div className="mt-4 md:hidden">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsMapVisible(true)}
              className="w-full"
            >
              Show Map
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-4">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
