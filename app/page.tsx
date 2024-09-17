// MapPage.tsx
"use client"; // Add this directive at the top of your file

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DrawingManager } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 41.8781,
  lng: -87.6298,
};

const apartments = [
  {
    id: 1,
    name: 'Luxury Apartment',
    address: '123 Luxury St, Chicago, IL 60601',
    price: '$2,500/month',
    lat: 41.8801,
    lng: -87.6308,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Modern Condo',
    address: '456 Modern Ave, Chicago, IL 60602',
    price: '$1,800/month',
    lat: 41.8765,
    lng: -87.6290,
    image: 'https://via.placeholder.com/150',
  },
  // Add more apartments here
];

const MapPage: React.FC = () => {
  const [filteredApartments, setFilteredApartments] = useState(apartments);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const searchBoxRef = useRef<HTMLInputElement | null>(null);

  const handleMapTypeChange = (type: google.maps.MapTypeId) => {
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const handleSearch = useCallback(() => {
    if (searchBoxRef.current && map) {
      const searchBox = new google.maps.places.SearchBox(searchBoxRef.current);

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (place.geometry?.viewport) {
            bounds.union(place.geometry.viewport);
          } else if (place.geometry?.location) {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }
  }, [map]);

  useEffect(() => {
    if (searchBoxRef.current) {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Map Container */}
      <div className="flex-1 h-full relative">
        <LoadScript
          googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
          libraries={['drawing', 'places']}
          onLoad={() => console.log('Google Maps API loaded')}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onLoad={mapInstance => setMap(mapInstance)}
          >
            {filteredApartments.map(apartment => (
              <Marker
                key={apartment.id}
                position={{ lat: apartment.lat, lng: apartment.lng }}
                title={apartment.name}
              />
            ))}
            <DrawingManager
              options={{
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [
                    google.maps.drawing.OverlayType.MARKER,
                    google.maps.drawing.OverlayType.POLYGON,
                    google.maps.drawing.OverlayType.CIRCLE,
                  ],
                },
              }}
            />
          </GoogleMap>

          {/* Map Controls */}
          <div className="absolute top-2 right-2 z-10 bg-white p-2 rounded-lg shadow-md">
            <button onClick={() => handleMapTypeChange(google.maps.MapTypeId.ROADMAP)}>Roadmap</button>
            <button onClick={() => handleMapTypeChange(google.maps.MapTypeId.SATELLITE)}>Satellite</button>
            <button onClick={() => handleMapTypeChange(google.maps.MapTypeId.TERRAIN)}>Terrain</button>
          </div>

          {/* Search Input */}
          <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded-lg shadow-md">
            <input
              ref={searchBoxRef}
              type="text"
              placeholder="Search by address"
              className="p-2 border rounded"
            />
          </div>
        </LoadScript>
      </div>

      {/* Apartment Cards */}
      <div className="lg:w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Available Apartments</h2>
        {filteredApartments.map(apartment => (
          <div key={apartment.id} className="bg-white shadow-lg rounded-lg p-4 mb-4">
            <img src={apartment.image} alt={apartment.name} className="w-full h-32 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold mb-2">{apartment.name}</h3>
            <p className="text-gray-700 mb-2">{apartment.address}</p>
            <p className="text-lg font-bold text-blue-500">{apartment.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapPage;
