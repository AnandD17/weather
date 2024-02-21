import { api } from "./config/axiosConfig.js";
import { defineCancelApiObject } from "./config/axiosUtils.js";
// import { errorResponseHandler, responseHandler } from "../utils/handler.js";
import {
  RAPID_HOST,
  RAPID_HOST_PLACES,
  RAPID_KEY,
  RAPID_KEY_PLACES,
} from "../constants/index.ts";

const HEADERS_WEATHER = {
  "X-RapidAPI-Key": RAPID_KEY,
  "X-RapidAPI-Host": RAPID_HOST,
};
const HEADERS_PLACES_API = {
  "X-RapidAPI-Key": RAPID_KEY_PLACES,
  "X-RapidAPI-Host": RAPID_HOST_PLACES,
};

export const CommonAPI = {
  /////////////////////////
  // Common Api
  ////////////////////////

  getWeatherData: async (params, cancel = false) => {
    try {
      const response = await api.request({
        url: "/current",
        method: "GET",
        headers: HEADERS_WEATHER,
        params,
        signal: cancel
          ? cancelApiObject[this.get.name].handleRequestCancellation().signal
          : undefined,
      });
      //   return responseHandler(response);
      return response;
    } catch (err) {
      throw err;
    }
  },
  getDailyWeatherData: async (params, cancel = false) => {
    try {
      const response = await api.request({
        url: "/daily",
        method: "GET",
        headers: HEADERS_WEATHER,
        params,
        signal: cancel
          ? cancelApiObject[this.get.name].handleRequestCancellation().signal
          : undefined,
      });
      //   return responseHandler(response);
      return response;
    } catch (err) {
      throw err;
    }
  },
  getHourlyWeatherData: async (params, cancel = false) => {
    try {
      const response = await api.request({
        url: "/hourly",
        method: "GET",
        headers: HEADERS_WEATHER,
        params,
        signal: cancel
          ? cancelApiObject[this.get.name].handleRequestCancellation().signal
          : undefined,
      });
      //   return responseHandler(response);
      return response;
    } catch (err) {
      throw err;
    }
  },
  getSuggestions: async (params, cancel = false) => {
    try {
      const response = await api.request({
        url: "/find_places",
        method: "GET",
        headers: HEADERS_WEATHER,
        params,
        signal: cancel
          ? cancelApiObject[this.get.name].handleRequestCancellation().signal
          : undefined,
      });
      //   return responseHandler(response);
      return response;
    } catch (err) {
      throw err;
    }
  },
  getNearestPlaces: async (params, cancel = false) => {
    try {
      const response = await api.request({
        url: "/nearest_place",
        method: "GET",
        headers: HEADERS_WEATHER,
        params,
        signal: cancel
          ? cancelApiObject[this.get.name].handleRequestCancellation().signal
          : undefined,
      });
      //   return responseHandler(response);
      return response;
    } catch (err) {
      throw err;
    }
  },
};

const cancelApiObject = defineCancelApiObject(CommonAPI);
