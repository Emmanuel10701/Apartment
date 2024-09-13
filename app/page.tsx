// pages/map.tsx
"use client";
import React from 'react';
import Map from './components/map/page';

const MapPage = () => {
  return (
    <div className="flex flex-col w-full h-screen p-10">
      <div className="flex-1 p-10">
        <Map />
      </div>
    </div>
  );
};

export default MapPage;
