import { configureStore } from "@reduxjs/toolkit";
import auth0Slice from "./auth0Slice";

const store = configureStore({
  reducer: {
    auth0Context: auth0Slice,
  },
});

export default store;
