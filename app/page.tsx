"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchNavbar from './components/filters/page'; // Ensure this path is correct

const apartments = [
  {
    id: 1,
    name: 'Luxury Apartment',
    address: '123 Luxury St, Chicago, IL 60601',
    minPrice: 2000,
    maxPrice: 2500,
    rentalType: 'Monthly',
    lat: 41.8801,
    lng: -87.6308,
    image: 'https://via.placeholder.com/150',
    description: 'A luxurious apartment with modern amenities and a great view.',
  },
  // Add more apartments with lat and lng as needed
];

const GoogleMapsPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredApartments, setFilteredApartments] = useState(apartments);
  const [sortOption, setSortOption] = useState<'price' | 'rentalType'>('price');
  const [view, setView] = useState<'map' | 'list'>('map'); // State to toggle between map and list view

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
          version: 'quarterly',
          libraries: ['places'],
        });

        await loader.load();

        const mapInstance = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center: { lat: 41.8781, lng: -87.6298 },
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: true,
        });

        apartments.forEach((apartment) => {
          new google.maps.Marker({
            map: mapInstance,
            position: { lat: apartment.lat, lng: apartment.lng },
            title: apartment.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(32, 32),
            },
          });
        });

        const input = searchBoxRef.current as HTMLInputElement;
        const searchBox = new google.maps.places.SearchBox(input);
        mapInstance.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        mapInstance.addListener('bounds_changed', () => {
          searchBox.setBounds(mapInstance.getBounds() as google.maps.LatLngBounds);
        });

        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          if (places && places.length > 0) {
            const place = places[0];
            if (place.geometry && place.geometry.location) {
              mapInstance.panTo(place.geometry.location);
              mapInstance.setZoom(14);
            }
          }
        });

        setMap(mapInstance);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();
  }, []);

  const handleMapTypeChange = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleSearch = (search: string) => {
    const filtered = apartments.filter(apartment =>
      apartment.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredApartments(filtered);
  };

  const handlePriceFilter = (min: number, max: number) => {
    const filtered = apartments.filter(apartment => 
      apartment.minPrice >= min && apartment.maxPrice <= max
    );
    setFilteredApartments(filtered);
  };

  const handleRentalTypeChange = (type: string) => {
    const filtered = apartments.filter(apartment =>
      apartment.rentalType === type || type === 'All'
    );
    setFilteredApartments(filtered);
  };

  const handleSortChange = (option: 'price' | 'rentalType') => {
    setSortOption(option);
    const sorted = [...filteredApartments].sort((a, b) => {
      if (option === 'price') {
        return a.minPrice - b.minPrice;
      } else {
        return a.rentalType.localeCompare(b.rentalType);
      }
    });
    setFilteredApartments(sorted);
  };

  return (
    <div className="relative h-screen flex flex-col lg:flex-row">
      <SearchNavbar
        onSearch={handleSearch}
        onPriceFilter={handlePriceFilter}
        onRentalTypeChange={handleRentalTypeChange}
        onSortChange={handleSortChange}
      />

      <button
        onClick={toggleDrawer}
        className="lg:hidden fixed top-4 left-4 z-10 p-2 bg-gray-800 text-white rounded-full"
        aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
      >
        <FontAwesomeIcon icon={drawerOpen ? faTimes : faBars} />
      </button>

      <div
        className={`fixed inset-0 lg:hidden z-20 bg-gray-800 text-white p-4 transition-transform transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4 text-white"
          aria-label="Close menu"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Map Controls</h2>
        <button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.ROADMAP)}
          className="block w-full mb-2 bg-blue-500 text-white p-2 rounded"
        >
          Roadmap
        </button>
        <button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.SATELLITE)}
          className="block w-full mb-2 bg-blue-500 text-white p-2 rounded"
        >
          Satellite
        </button>
        <button
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.TERRAIN)}
          className="block w-full mb-2 bg-blue-500 text-white p-2 rounded"
        >
          Terrain
        </button>
      </div>

      <div className="relative flex-grow">
        <div className={`relative ${view === 'map' ? 'flex' : 'hidden'}`}>
          <div
            ref={mapRef}
            className="w-full h-full"
          />
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="Search places"
            className="absolute top-4 left-4 z-10 p-2 bg-white rounded shadow-md w-1/2 lg:w-1/3"
            aria-label="Search places"
          />
        </div>

        <div className={`flex-grow ${view === 'list' ? 'flex' : 'hidden'} flex-col`}>
          <div className="w-full h-1/3 overflow-y-auto bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-4">Available Apartments</h2>
            {filteredApartments.map((apartment) => (
              <div
                key={apartment.id}
                className="bg-white shadow-lg rounded-lg mb-4"
              >
                <img
                  src={apartment.image}
                  alt={apartment.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{apartment.name}</h3>
                  <p className="text-gray-700 mb-2">{apartment.address}</p>
                  <p className="text-lg font-bold text-blue-500">
                    ${apartment.minPrice} - ${apartment.maxPrice}/month
                  </p>
                  <p className="text-gray-500">{apartment.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsPage;
