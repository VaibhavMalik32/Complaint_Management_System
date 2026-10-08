import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents
} from "react-leaflet";
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

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, {
        duration: 1
      });
    }
  }, [position, map]);

  return null;
}

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
          const newPosition = marker.getLatLng();

          setPosition([
            newPosition.lat,
            newPosition.lng
          ]);
        }
      }}
    />
  ) : null;
}

function LocationPicker({ onLocationSelect, onClose }) {
  const [position, setPosition] = useState(null);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
        throw new Error(
          "Unable to find address for this location."
        );
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

  const selectPosition = async (newPosition) => {
    setPosition(newPosition);

    await reverseGeocode(
      newPosition[0],
      newPosition[1]
    );
  };

  const searchPlace = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a place to search.");
      return;
    }

    try {
      setLoadingSearch(true);
      setError("");
      setSearchResults([]);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to search for this place."
        );
      }

      const data = await response.json();

      if (!data.length) {
        setError(
          "No location found. Try a different search."
        );
        return;
      }

      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSearch(false);
    }
  };

  const selectSearchResult = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    const newPosition = [lat, lng];

    setPosition(newPosition);
    setSearchResults([]);
    setSearchQuery(result.display_name);
    setError("");

    await reverseGeocode(lat, lng);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchPlace();
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        await selectPosition([lat, lng]);

        setLoadingLocation(false);
      },
      (err) => {
        setLoadingLocation(false);

        if (err.code === 1) {
          setError(
            "Location permission was denied. Please allow location access."
          );
        } else if (err.code === 2) {
          setError(
            "Your location could not be determined."
          );
        } else {
          setError(
            "Unable to detect your current location."
          );
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
      setError(
        "Please select a location on the map."
      );
      return;
    }

    await reverseGeocode(
      position[0],
      position[1]
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-black">
              Select Complaint Location
            </h2>

            <p className="text-sm text-black">
              Search, detect your location or select a point on the map
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-black hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="border-b px-6 py-4">

          <div className="relative mb-4">

            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchResults([]);
                  setError("");
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search a place, area, landmark..."
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={searchPlace}
                disabled={loadingSearch}
                className="rounded-xl bg-slate-300 px-5 py-3 font-semibold text-black transition disabled:opacity-50"
              >
                {loadingSearch
                  ? "Searching..."
                  : "Search"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">

                {searchResults.map((result, index) => (
                  <button
                    key={`${result.place_id}-${index}`}
                    type="button"
                    onClick={() =>
                      selectSearchResult(result)
                    }
                    className="block w-full border-b px-4 py-3 text-left text-sm text-gray-700 transition last:border-b-0 hover:bg-green-50"
                  >
                    {result.display_name}
                  </button>
                ))}

              </div>
            )}

          </div>

          <button
            type="button"
            onClick={detectLocation}
            disabled={loadingLocation}
            className="rounded-xl bg-slate-300 px-5 py-3 font-semibold text-black transition disabled:opacity-50"
          >
            {loadingLocation
              ? "Detecting Location..."
              : "Use My Current Location"}
          </button>

          {position && (
            <div className="mt-3 text-sm text-black">
              Latitude: {position[0].toFixed(6)} | Longitude:{" "}
              {position[1].toFixed(6)}
            </div>
          )}

          {loadingAddress && (
            <p className="mt-2 text-sm text-black">
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
            center={defaultPosition}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
          >

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController position={position} />

            <LocationMarker
              position={position}
              setPosition={selectPosition}
            />

          </MapContainer>

        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-black hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!position || loadingAddress}
            className="rounded-xl bg-slate-300 px-6 py-3 font-semibold text-black disabled:opacity-50 hover:bg-slate-200"
          >
            {loadingAddress
              ? "Getting Address..."
              : "Confirm Location"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default LocationPicker;