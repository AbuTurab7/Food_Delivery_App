import { useEffect, useState } from "react";
import { setAddress, setLocation } from "../Utilities/mapSlice";
import { useDispatch } from "react-redux";

export const UseGetCurrentUserLocation = () => {
  // const [location, setLocation] = useState({
  //   lat: null,
  //   lon: null,
  //   address: "",
  // });

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
        console.log(position.coords.latitude , position.coords.longitude);

        dispatch(setLocation({lat , lon}));
        // setLocation((prev) => ({ ...prev, lat, lon }));
        // console.log("Your location:", location);
        // Fetch address from coordinates
        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${
              import.meta.env.VITE_GEO_API_KEY
            }`
          );
          const result = await res.json();
          console.log(result);

          const address = result?.results?.[0]?.formatted || "Unknown location";
          dispatch(setAddress(address));
          // setLocation({ lat, lon, address });
            // console.log("Your location:", location);
            // console.log("Your address:", address);
        } catch (err) {
          console.error("Error fetching address:", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };
  // console.log("Your location:", location);
  return { getUserCoordinates };
};
