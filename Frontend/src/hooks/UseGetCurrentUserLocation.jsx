import { setAddress, setLocation } from "../Utilities/mapSlice";
import { useDispatch } from "react-redux";

export const UseGetCurrentUserLocation = () => {

  const dispatch = useDispatch();

  const getUserCoordinates = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        dispatch(setLocation({lat , lon}));
        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${
              import.meta.env.VITE_GEO_API_KEY
            }`
          );
          const result = await res.json();
          const address = result?.results?.[0]?.formatted || "Unknown location";
          dispatch(setAddress(address));
        } catch (err) {
          console.error("Error fetching address:", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };
  return { getUserCoordinates };
};
