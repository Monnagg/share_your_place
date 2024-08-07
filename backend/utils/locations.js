const axios = require("axios");
const HttpError = require("../models/http-error");
 const API_KEY = "AIzaSyB1zDFJe81H-rHhQHmOhi-IhUcnCzl3HPM";
// const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  //   return {
  //     lat: 40.7484405,
  //     lng: -73.9878584,
  //   };
  console.log("..." + address + "...");
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
//   console.log(response.data)
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  console.log(`creating coordinates: ${coordinates}`);
  return coordinates;
}

module.exports = getCoordsForAddress;
