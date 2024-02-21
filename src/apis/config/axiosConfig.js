import axios from "axios";

import { WEATHER_BASE_URL } from "../../constants";

export const api = axios.create({
  withCredentials: false,
  baseURL: WEATHER_BASE_URL,
});

const errorHandler = (error) => {
  const statusCode = error.response?.status;

  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  return Promise.reject(error);
};

api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});
