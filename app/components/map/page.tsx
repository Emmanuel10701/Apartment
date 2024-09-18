import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

export default function Map() {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [userPosition] = useState({
    latitude: 41.8781, // Default latitude (e.g., Chicago)
    longitude: -87.6298, // Default longitude (e.g., Chicago)
  });
  
  const [nearbyMarkers, setNearbyMarkers] = useState([]);

  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = L.map(mapRef.current, {
        center: [userPosition.latitude, userPosition.longitude],
        zoom: 13,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstance);

      // Add user's marker
      userMarkerRef.current = L.marker([userPosition.latitude, userPosition.longitude])
        .addTo(mapInstance)
        .bindPopup("User");

      // Add nearby markers
      nearbyMarkers.forEach(({ latitude, longitude }) => {
        L.marker([latitude, longitude])
          .addTo(mapInstance)
          .bindPopup(`lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`);
      });

      // Handle map clicks to add new markers
      mapInstance.on("click", (e) => {
        const { lat: latitude, lng: longitude } = e.latlng;
        L.marker([latitude, longitude])
          .addTo(mapInstance)
          .bindPopup(`lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`);
        setNearbyMarkers((prevMarkers) => [
          ...prevMarkers,
          { latitude, longitude },
        ]);
      });

      // Cleanup function to remove the map instance on unmount
      return () => {
        mapInstance.remove();
      };
    }
  }, [mapRef, nearbyMarkers, userPosition]);

  return <div ref={mapRef} className="w-full h-full"></div>;
}
