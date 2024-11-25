"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { AddressAutocomplete } from "./AddressAutocomplete";

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProperty: (propertyData: any) => void;
}

export function AddPropertyModal({ open, onOpenChange, onAddProperty }: AddPropertyModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyName: "",
    propertyType: "",
    buildYear: "",
    roofType: "",
    numberOfStories: "",
    squareFootage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "address":
        return !value.trim() ? "Address is required" : "";
      case "city":
        return !value.trim() ? "City is required" : "";
      case "state":
        return !value.trim() ? "State is required" : "";
      case "zipCode":
        return !value.trim() ? "ZIP code is required" : "";
      case "propertyName":
        return !value.trim() ? "Property name is required" : "";
      case "propertyType":
        return !value ? "Property type is required" : "";
      case "buildYear":
        if (!value.trim()) return "Build year is required";
        const year = parseInt(value);
        return (year < 1800 || year > new Date().getFullYear()) 
          ? "Please enter a valid year" 
          : "";
      case "roofType":
        return !value ? "Roof type is required" : "";
      case "numberOfStories":
        if (!value.trim()) return "Number of stories is required";
        const stories = parseInt(value);
        return (stories < 1 || stories > 200) 
          ? "Please enter a valid number of stories" 
          : "";
      case "squareFootage":
        if (!value.trim()) return "Square footage is required";
        const footage = parseInt(value);
        return (footage < 100 || footage > 1000000) 
          ? "Please enter a valid square footage" 
          : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (name: string) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleAddressSelect = (addressData: {
    fullAddress: string;
    city: string;
    state: string;
    zipCode: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.fullAddress,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode
    }));

    // Validate the newly populated fields
    ["city", "state", "zipCode"].forEach(field => {
      if (touchedFields[field]) {
        const error = validateField(field, addressData[field as keyof typeof addressData]);
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    });
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouchedFields(allTouched);

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    onAddProperty(formData);
    onOpenChange(false);
    setFormData({
      address: "",
      city: "",
      state: "",
      zipCode: "",
      propertyName: "",
      propertyType: "",
      buildYear: "",
      roofType: "",
      numberOfStories: "",
      squareFootage: "",
    });
    setErrors({});
    setTouchedFields({});
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button">
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Add New Property</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[calc(90vh-8rem)] px-6">
          <div className="space-y-8 py-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              
              <div className="space-y-4">
                <AddressAutocomplete
                  value={formData.address}
                  onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
                  onBlur={() => handleBlur('address')}
                  onAddressSelect={handleAddressSelect}
                  error={errors.address}
                  touched={touchedFields.address}
                />

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="city">City</Label>
                      <InfoTooltip content="Enter the city name" />
                    </div>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, city: e.target.value }));
                        if (touchedFields.city) {
                          handleBlur('city');
                        }
                      }}
                      onBlur={() => handleBlur('city')}
                      className={touchedFields.city && errors.city ? "border-destructive" : ""}
                      placeholder="New York"
                    />
                    {touchedFields.city && errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="state">State</Label>
                      <InfoTooltip content="Select the state" />
                    </div>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, state: e.target.value }));
                        if (touchedFields.state) {
                          handleBlur('state');
                        }
                      }}
                      onBlur={() => handleBlur('state')}
                      className={touchedFields.state && errors.state ? "border-destructive" : ""}
                      placeholder="California"
                    />
                    {touchedFields.state && errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, zipCode: e.target.value }));
                        if (touchedFields.zipCode) {
                          handleBlur('zipCode');
                        }
                      }}
                      onBlur={() => handleBlur('zipCode')}
                      className={touchedFields.zipCode && errors.zipCode ? "border-destructive" : ""}
                      placeholder="12345"
                    />
                    {touchedFields.zipCode && errors.zipCode && (
                      <p className="text-sm text-destructive">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rest of the form remains the same */}
            {/* Additional Details section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="propertyName">Property Name</Label>
                    <InfoTooltip content="Enter a unique name for the property" />
                  </div>
                  <Input
                    id="propertyName"
                    value={formData.propertyName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, propertyName: e.target.value }));
                      if (touchedFields.propertyName) {
                        handleBlur('propertyName');
                      }
                    }}
                    onBlur={() => handleBlur('propertyName')}
                    className={touchedFields.propertyName && errors.propertyName ? "border-destructive" : ""}
                    placeholder="Villa Mairea"
                  />
                  {touchedFields.propertyName && errors.propertyName && (
                    <p className="text-sm text-destructive">{errors.propertyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <InfoTooltip content="Select the type of property" />
                  </div>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, propertyType: value }));
                      handleBlur('propertyType');
                    }}
                  >
                    <SelectTrigger className={touchedFields.propertyType && errors.propertyType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family Home</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                    </SelectContent>
                  </Select>
                  {touchedFields.propertyType && errors.propertyType && (
                    <p className="text-sm text-destructive">{errors.propertyType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="buildYear">Build Year</Label>
                    <InfoTooltip content="Enter the year the property was built" />
                  </div>
                  <Input
                    id="buildYear"
                    type="number"
                    value={formData.buildYear}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, buildYear: e.target.value }));
                      if (touchedFields.buildYear) {
                        handleBlur('buildYear');
                      }
                    }}
                    onBlur={() => handleBlur('buildYear')}
                    className={touchedFields.buildYear && errors.buildYear ? "border-destructive" : ""}
                    placeholder="2005"
                  />
                  {touchedFields.buildYear && errors.buildYear && (
                    <p className="text-sm text-destructive">{errors.buildYear}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="roofType">Roof Type</Label>
                    <InfoTooltip content="Select the type of roof" />
                  </div>
                  <Select
                    value={formData.roofType}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, roofType: value }));
                      handleBlur('roofType');
                    }}
                  >
                    <SelectTrigger className={touchedFields.roofType && errors.roofType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asphalt">Asphalt Shingle</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="tile">Tile</SelectItem>
                      <SelectItem value="slate">Slate</SelectItem>
                    </SelectContent>
                  </Select>
                  {touchedFields.roofType && errors.roofType && (
                    <p className="text-sm text-destructive">{errors.roofType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="numberOfStories">Number of Stories</Label>
                    <InfoTooltip content="Enter the number of floors" />
                  </div>
                  <Input
                    id="numberOfStories"
                    type="number"
                    value={formData.numberOfStories}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, numberOfStories: e.target.value }));
                      if (touchedFields.numberOfStories) {
                        handleBlur('numberOfStories');
                      }
                    }}
                    onBlur={() => handleBlur('numberOfStories')}
                    className={touchedFields.numberOfStories && errors.numberOfStories ? "border-destructive" : ""}
                    placeholder="2"
                  />
                  {touchedFields.numberOfStories && errors.numberOfStories && (
                    <p className="text-sm text-destructive">{errors.numberOfStories}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="squareFootage">Square Footage</Label>
                    <InfoTooltip content="Enter the total square footage" />
                  </div>
                  <Input
                    id="squareFootage"
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, squareFootage: e.target.value }));
                      if (touchedFields.squareFootage) {
                        handleBlur('squareFootage');
                      }
                    }}
                    onBlur={() => handleBlur('squareFootage')}
                    className={touchedFields.squareFootage && errors.squareFootage ? "border-destructive" : ""}
                    placeholder="2500"
                  />
                  {touchedFields.squareFootage && errors.squareFootage && (
                    <p className="text-sm text-destructive">{errors.squareFootage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between p-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Discard Changes
          </Button>
          <Button onClick={handleSubmit}>
            Add Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}