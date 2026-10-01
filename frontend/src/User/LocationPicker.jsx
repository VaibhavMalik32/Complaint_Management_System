import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
        }
      }}
    />
  ) : null;
}

function LocationPicker({ onLocationSelect, onClose }) {
  const [position, setPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState("");

  const defaultPosition = [28.6139, 77.2090];

  const reverseGeocode = async (lat, lng) => {
    try {
      setLoadingAddress(true);
      setError("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error("Unable to find address for this location.");
      }

      const data = await response.json();

      const address =
        data.display_name ||
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      onLocationSelect({
        latitude: lat,
        longitude: lng,
        location: address
      });

      setPosition([lat, lng]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAddress(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        setPosition([lat, lng]);
        await reverseGeocode(lat, lng);
        setLoadingLocation(false);
      },
      (err) => {
        setLoadingLocation(false);

        if (err.code === 1) {
          setError("Location permission was denied. Please allow location access.");
        } else if (err.code === 2) {
          setError("Your location could not be determined.");
        } else {
          setError("Unable to detect your current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleConfirm = async () => {
    if (!position) {
      setError("Please select a location on the map.");
      return;
    }

    await reverseGeocode(position[0], position[1]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold">Select Complaint Location</h2>
            <p className="text-sm text-gray-500">
              Detect your location or select a point on the map
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="border-b px-6 py-4">
          <button
            type="button"
            onClick={detectLocation}
            disabled={loadingLocation}
            className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loadingLocation ? "Detecting Location..." : "Use My Current Location"}
          </button>

          {position && (
            <div className="mt-3 text-sm text-gray-600">
              Latitude: {position[0].toFixed(6)} | Longitude:{" "}
              {position[1].toFixed(6)}
            </div>
          )}

          {loadingAddress && (
            <p className="mt-2 text-sm text-gray-500">
              Finding address...
            </p>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="h-[450px]">
          <MapContainer
            center={position || defaultPosition}
            zoom={position ? 17 : 12}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
              position={position}
              setPosition={(newPosition) => {
                setPosition(newPosition);
                reverseGeocode(newPosition[0], newPosition[1]);
              }}
            />
          </MapContainer>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!position || loadingAddress}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loadingAddress ? "Getting Address..." : "Confirm Location"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;