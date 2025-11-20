import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import home from "../assets/home.png";
import scooter from "../assets/scooter.png";
import L from "leaflet";
import { useEffect, useState } from "react";

const homeIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function interpolatePoints(lat1, lon1, lat2, lon2, n = 20) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const lat = lat1 + (lat2 - lat1) * t;
    const lon = lon1 + (lon2 - lon1) * t;
    pts.push([lat, lon]);
  }
  return pts;
}

export function OrderTrackingMap(order) {
  const [deliveryPos, setDeliveryPos] = useState(null);
  const [restCoords, setRestCoords] = useState({ restLat: "", restLon: "" });
  const restAddress =
    order.order.restaurant.restAddress +
    " " +
    order.order.deliveryAddress.text.slice(-27);
  const customerLat = order.order.deliveryAddress.lat;
  const customerLon = order.order.deliveryAddress.lon;
  let deliveryBoyLat = restCoords.restLat;
  let deliveryBoyLon = restCoords.restLon;
  const center = [deliveryBoyLat, deliveryBoyLon];
  const path = deliveryPos ? [deliveryPos, [customerLat, customerLon]] : [];

  async function fetchRestaurantCoordinates() {
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${restAddress}&format=json&apiKey=${
          import.meta.env.VITE_GEO_API_KEY
        }`
      );
      const result = await res.json();

      setRestCoords({
        restLat: result?.results?.[0]?.lat,
        restLon: result?.results?.[0]?.lon,
      });
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  }

  function RecenterMap() {
    if (location.lat && location.lon) {
      const map = useMap();
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
    return null;
  }

  useEffect(() => {
    fetchRestaurantCoordinates();
  }, []);

  useEffect(() => {
    if (!restCoords.restLat || !restCoords.restLon) return;

    const customerLat = order.order.deliveryAddress.lat;
    const customerLon = order.order.deliveryAddress.lon;

    const points = interpolatePoints(
      restCoords.restLat,
      restCoords.restLon,
      customerLat,
      customerLon,
      20
    );

    let index = 0;
    setDeliveryPos(points[0]);

    const interval = setInterval(() => {
      index++;
      if (index >= points.length) {
        clearInterval(interval);
        return;
      }
      setDeliveryPos(points[index]);
    }, 10000);

    return () => clearInterval(interval);
  }, [restCoords]);

  

  return (
    <div className="delivery-map-container">
      <div className="delivery-map">
        {customerLat && customerLon && deliveryBoyLat && deliveryBoyLon ? (
          <MapContainer
            center={center}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {}
            <RecenterMap location={[deliveryBoyLat, deliveryBoyLon]} />
            {deliveryPos && (
              <Marker position={deliveryPos} icon={deliveryBoyIcon} />
            )}
            <Marker
              icon={homeIcon}
              position={[customerLat, customerLon]}
            ></Marker>
            <Polyline
              positions={path}
              color="blue"
              width={4}
              dashArray="5, 10"
            />
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}
