import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Load marker icons from a CDN instead of local node_modules files - this
// avoids a class of "failed to resolve" bundler errors tied to how
// leaflet's image assets get installed/copied.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// A small "you selected the right spot" map preview, built on free
// OpenStreetMap tiles - no API key or billing account needed.
function AddressMapPreview({ latitude, longitude, zoom = 16, height = 160 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || latitude == null || longitude == null) {
      return undefined;
    }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
    }).setView([latitude, longitude], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markerRef.current = L.marker([latitude, longitude]).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    if (!mapRef.current && containerRef.current) {
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
      }).setView([latitude, longitude], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markerRef.current = L.marker([latitude, longitude]).addTo(map);
      mapRef.current = map;
      return;
    }

    mapRef.current.setView([latitude, longitude], zoom);
    markerRef.current?.setLatLng([latitude, longitude]);
  }, [latitude, longitude, zoom]);

  if (latitude == null || longitude == null) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-dark-100">
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
}

export default AddressMapPreview;