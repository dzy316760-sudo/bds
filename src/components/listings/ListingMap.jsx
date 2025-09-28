"use client";

import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const libraries = [];

export default function ListingMap({ latitude, longitude }) {
  const center = { lat: latitude, lng: longitude };
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} libraries={libraries}>
      <div className="map-container">
        <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} zoom={15} center={center}>
          <Marker position={center} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
