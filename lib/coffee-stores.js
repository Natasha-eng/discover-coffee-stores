import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStore = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 40,
  });

  const unsplashResults = photos.response.results;

  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLong = "53.89507782851608%2C27.53656367181136",
  limit = 6
) => {
  const photos = await getListOfCoffeePhotos();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStore(latLong, "coffee", limit),
    options
  );
  const data = await response.json();
  return data.results.map((result, idx) => {
    return {
      name: result.name,
      address: result.location.address,
      location: result.location.region,
      id: result.fsq_id,
      imgUrl: photos.length > 0 ? photos[idx] : null,
    };
  });
};
