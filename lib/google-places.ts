"use client";

import { getGoogleMapsServices } from "./google-maps";

export const getPlacePhotoFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const { placesService } = await getGoogleMapsServices();

    return new Promise((resolve) => {
      const request = {
        location: new google.maps.LatLng(lat, lng),
        radius: 50, // Search within 50 meters of the coordinates
        type: ['establishment', 'premise'], // Look for buildings and establishments
      };

      placesService.nearbySearch(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results?.[0]?.photos?.[0]
        ) {
          const photo = results[0].photos[0];
          const photoUrl = photo.getUrl({ maxWidth: 1200, maxHeight: 800 });
          resolve(photoUrl);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching place photo:", error);
    return null;
  }
};