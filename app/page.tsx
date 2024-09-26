"use client";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Footer from "./components/Footer/page"; // Adjust this path
import SearchNavbar from "./components/filters/page"; // Adjust this path
import ApartmentCard from "./components/card/page"; // Adjust this path
import { FaSatellite, FaMountain } from "react-icons/fa";

const center = { lat: 41.8781, lng: -87.6298 };

interface Apartment {
  id: number;
  title: string;
  minPrice: number;
  rentalType: string;
  starRating: number;
  propertyType: string;
  images: string[];
  phoneNumber: string;
  email: string;
  location: string;
}

const apartments: Apartment[] = [
  {
    id: 1,
    title: "Luxury Apartment",
    minPrice: 1500,
    rentalType: "Monthly",
    starRating: 4,
    propertyType: "Apartment",
    images: [
      "https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg",
    ],
    phoneNumber: "1234567890",
    email: "luxury@apartment.com",
    location: "123 Luxury St, Beverly Hills, CA",
  },
  // Add more apartments as needed
];

interface SearchFilters {
  search: string;
  location?: string; // Added location property
  minRent?: number;
  maxRent?: number;
  rentalType?: string;
  starRating?: number;
  propertyType?: string;
}

const MainComponent: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(apartments);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(true);
  const [loadingMarkers, setLoadingMarkers] = useState(false);

  const geocodeLocation = async (location: string): Promise<google.maps.LatLngLiteral> => {
    const geocoder = new google.maps.Geocoder();
    return new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
      geocoder.geocode({ addreses: location }, (results, status) => {
        if (status === "OK" && results && results[0].geometry.location) {
          resolve(results[0].geometry.location.toJSON());
        } else {
          reject(new Error("Geocode was not successful for the following reason: " + status));
        }
      });
    });
  };

  const loadApartmentMarkers = async () => {
    setLoadingMarkers(true);
    try {
      const newMarkers = await Promise.all(
        filteredApartments.map(async (apartment) => {
          try {
            const location = await geocodeLocation(apartment.location);
            return location;
          } catch (error) {
            console.error(`Error geocoding location for ${apartment.title}:`, error);
            return null;
          }
        })
      );
      const validMarkers = newMarkers.filter(Boolean) as google.maps.LatLngLiteral[];

      if (validMarkers.length === 0) {
        console.warn("No valid markers found. Check apartment locations.");
      }

      setMarkers(validMarkers);
    } catch (error) {
      console.error("Error loading apartment markers:", error);
    } finally {
      setLoadingMarkers(false);
    }
  };

  useEffect(() => {
    if (filteredApartments.length > 0) {
      loadApartmentMarkers();
    } else {
      setMarkers([]);
    }
  }, [filteredApartments]);

  const handleSearch = async (filters: SearchFilters) => {
    let filtered = apartments;

    if (filters.search) {
      const lowercasedSearch = filters.search.toLowerCase();
      filtered = filtered.filter(
        (apartment) =>
          apartment.title.toLowerCase().includes(lowercasedSearch) ||
          apartment.location.toLowerCase().includes(lowercasedSearch) ||
          apartment.propertyType.toLowerCase().includes(lowercasedSearch)
      );
    }

    if (filters.rentalType) {
      filtered = filtered.filter(
        (apartment) => apartment.rentalType === filters.rentalType
      );
    }

    if (filters.starRating !== undefined && filters.starRating > 0) {
      filtered = filtered.filter(
        (apartment) => apartment.starRating >= filters.starRating!
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(
        (apartment) => apartment.propertyType === filters.propertyType
      );
    }

    if (filters.minRent !== undefined && filters.maxRent !== undefined) {
      filtered = filtered.filter(
        (apartment) =>
          apartment.minPrice >= filters.minRent! &&
          apartment.minPrice <= filters.maxRent!
      );
    } else if (filters.minRent !== undefined) {
      filtered = filtered.filter((apartment) => apartment.minPrice >= filters.minRent!);
    } else if (filters.maxRent !== undefined) {
      filtered = filtered.filter((apartment) => apartment.minPrice <= filters.maxRent!);
    }

    // Handle geocoding for the location filter
    if (filters.location) {
      try {
        const location = await geocodeLocation(filters.location);
        // You might want to filter apartments based on proximity to the location here
        // For now, we just include it in the filtered apartments
      } catch (error) {
        console.error(`Error geocoding location "${filters.location}":`, error);
      }
    }

    setFilteredApartments(filtered);
  };

  const clearSearch = () => {
    setFilteredApartments(apartments);
  };

  const setMapType = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <svg className="w-20 h-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="4" />
          <path d="M12 6v6l4 2" strokeWidth="2" />
        </svg>
        <p className="mb-4">Failed to load Google Maps. Please check your network connection.</p>
        <Button variant="contained" color="primary" onClick={handleReload}>
          Reload
        </Button>
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
    <div className="relative">
      <SearchNavbar onSearch={handleSearch} />
      <div className="flex flex-col md:flex-row h-screen relative">
        <div
          className={`md:w-2/3 w-full ${isMapVisible ? "fixed" : "hidden"} md:block fixed md:relative top-0 left-0 right-0 bottom-0 z-0`}
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
          <div className="absolute bottom-20 left-4 p-2 flex gap-2 bg-white shadow-lg rounded-lg z-10">
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
          <div className="absolute top-4 right-4 z-10 md:hidden">
            <Button variant="contained" color="primary" onClick={() => setIsMapVisible(false)}>
              Show Apartments
            </Button>
          </div>
        </div>
        <div
          className={`md:w-1/3 w-full ${isMapVisible ? "hidden" : "block"} md:block fixed md:relative top-0 right-0 bottom-0 overflow-y-auto p-4 bg-white z-10`}
        >
          <h2 className="text-xl font-bold mb-4">Available Apartments</h2>
          {loadingMarkers && <CircularProgress />}
          <div className="grid grid-cols-1 gap-4">
            {filteredApartments.length > 0 ? (
              filteredApartments.map((apartment) => (
                <ApartmentCard
                  key={apartment.id}
                  name={apartment.title}
                  minPrice={apartment.minPrice}
                  rentalType={apartment.rentalType}
                  starRating={apartment.starRating}
                  propertyType={apartment.propertyType}
                  images={apartment.images}
                  phoneNumber={apartment.phoneNumber}
                  email={apartment.email}
                  location={apartment.location}
                />
              ))
            ) : (
              <p>No apartments found.</p>
            )}
            <Footer />
          </div>
          <div className="md:hidden absolute top-2 left-4 z-10">
            <Button variant="contained" color="secondary" onClick={() => setIsMapVisible(true)}>
              Show Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
