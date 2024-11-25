"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card } from "@/components/ui/card";
import { Property } from "@/lib/types";

interface PropertyMapProps {
  property: Property;
}

export function PropertyMap({ property }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const map = new Map(mapRef.current!, {
        center: property.coordinates,
        zoom: 15,
        mapId: "property_map",
        disableDefaultUI: true,
        zoomControl: true,
      });

      new google.maps.Marker({
        position: property.coordinates,
        map,
        title: property.address,
      });
    };

    initMap();
  }, [property]);

  return (
    <Card className="overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-[300px]"
      />
    </Card>
  );
}