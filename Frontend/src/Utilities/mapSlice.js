import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "mapSlice",
  initialState: {
    location: {
      lat: 26.84979435696015,
      lon: 80.9315447588758,
    },
    address: "",
  },
  reducers: {
    setLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddress: (state, action) => {
      const address = action.payload;
      state.address = address;
    },
  },
});

export const { setLocation, setAddress } = mapSlice.actions;
export default mapSlice.reducer;
