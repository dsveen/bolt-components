"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getGoogleMapsServices } from "@/lib/google-maps";
import { useToast } from "@/components/ui/use-toast";

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    fullAddress: string;
    city: string;
    state: string;
    zipCode: string;
  }) => void;
  error?: string;
  touched?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function AddressAutocomplete({
  onAddressSelect,
  error,
  touched,
  value,
  onChange,
  onBlur
}: AddressAutocompleteProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [servicesInitialized, setServicesInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initServices = async () => {
      try {
        setIsLoading(true);
        await getGoogleMapsServices();
        setServicesInitialized(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize address search. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initServices();

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toast]);

  const handleInputChange = async (value: string) => {
    onChange(value);

    if (!value.trim() || !servicesInitialized) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    try {
      setIsLoading(true);
      const { autocompleteService } = await getGoogleMapsServices();
      
      const response = await autocompleteService.getPlacePredictions({
        input: value,
        componentRestrictions: { country: "us" },
        types: ["address"]
      });

      setPredictions(response.predictions);
      setShowPredictions(true);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictions([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch address suggestions. Please try typing the complete address.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictionSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    try {
      const { placesService } = await getGoogleMapsServices();
      
      const request = {
        placeId: prediction.place_id,
        fields: ["address_components"]
      };

      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.address_components) {
          const addressData = {
            fullAddress: prediction.structured_formatting.main_text,
            city: "",
            state: "",
            zipCode: ""
          };

          place.address_components.forEach(component => {
            if (component.types.includes("locality")) {
              addressData.city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
              addressData.state = component.short_name;
            }
            if (component.types.includes("postal_code")) {
              addressData.zipCode = component.long_name;
            }
          });

          onChange(prediction.structured_formatting.main_text);
          onAddressSelect(addressData);
          setShowPredictions(false);
        }
      });
    } catch (error) {
      console.error("Error fetching place details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get address details. Please try again.",
      });
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="address">Address</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Enter the complete street address</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative">
        <Input
          id="address"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            touched && error ? "border-destructive" : "",
            isLoading ? "pr-10" : ""
          )}
          placeholder="Start typing to search..."
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {touched && error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-2 hover:bg-accent cursor-pointer"
              onClick={() => handlePredictionSelect(prediction)}
            >
              <p className="font-medium">{prediction.structured_formatting.main_text}</p>
              <p className="text-sm text-muted-foreground">
                {prediction.structured_formatting.secondary_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}