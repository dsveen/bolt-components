"use client";

import { Loader } from "@googlemaps/js-api-loader";

let loader: Loader | null = null;
let placesService: google.maps.places.PlacesService | null = null;
let autocompleteService: google.maps.places.AutocompleteService | null = null;

export const initGoogleMapsServices = async () => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.");
  }

  try {
    if (!loader) {
      loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places"],
      });
    }

    await loader.load();
    
    if (!placesService) {
      const tempDiv = document.createElement("div");
      document.body.appendChild(tempDiv);
      placesService = new google.maps.places.PlacesService(tempDiv);
    }

    if (!autocompleteService) {
      autocompleteService = new google.maps.places.AutocompleteService();
    }

    return {
      placesService,
      autocompleteService,
    };
  } catch (error) {
    console.error("Error initializing Google Maps services:", error);
    throw error;
  }
};

export const getGoogleMapsServices = async () => {
  try {
    if (!placesService || !autocompleteService) {
      return await initGoogleMapsServices();
    }
    return { placesService, autocompleteService };
  } catch (error) {
    console.error("Error getting Google Maps services:", error);
    throw error;
  }
};