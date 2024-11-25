"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, Building2, Home, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { properties } from "@/lib/data";
import { PropertyStats } from "@/components/PropertyStats";
import { WeatherEvents } from "@/components/WeatherEvents";
import { PropertyHistory } from "@/components/PropertyHistory";
import { DocumentTimeline } from "@/components/DocumentTimeline";
import { PropertyMap } from "@/components/PropertyMap";
import { InsuranceDetails } from "@/components/InsuranceDetails";
import { InsuranceDocumentViewer } from "@/components/InsuranceDocumentViewer";
import { Document } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { getPlacePhotoFromCoordinates } from "@/lib/google-places";
import { RoofAssessmentModal } from "./RoofAssessmentModal";

export function PropertyDetails() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState(
    properties.find((p) => p.id === Number(id))
  );
  const [propertyPhoto, setPropertyPhoto] = useState<string | null>(null);
  const [isRoofAssessmentModalOpen, setIsRoofAssessmentModalOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyPhoto = async () => {
      if (propertyData?.coordinates) {
        const photo = await getPlacePhotoFromCoordinates(
          propertyData.coordinates.lat,
          propertyData.coordinates.lng
        );
        if (photo) {
          setPropertyPhoto(photo);
        }
      }
    };

    fetchPropertyPhoto();
  }, [propertyData]);

  if (!propertyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const PropertyIcon = propertyData.type === "apartment" ? Building2 : Home;

  const handleDocumentUpdate = (documentId: string, updates: Partial<Document>) => {
    setPropertyData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: prev.documents.map(doc =>
          doc.id === documentId ? { ...doc, ...updates } : doc
        ),
      };
    });
    toast({
      title: "Document updated",
      description: "The document has been successfully updated.",
    });
  };

  const handleDocumentDelete = (documentId: string) => {
    setPropertyData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: prev.documents.filter(doc => doc.id !== documentId),
      };
    });
    toast({
      title: "Document deleted",
      description: "The document has been successfully deleted.",
    });
  };

  const handleDocumentUpload = (newDocument: Omit<Document, "id">) => {
    const documentWithId: Document = {
      ...newDocument,
      id: `doc${Date.now()}`,
    };

    setPropertyData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: [...prev.documents, documentWithId],
      };
    });

    toast({
      title: "Document uploaded",
      description: "The document has been successfully uploaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <PropertyIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <CardTitle className="text-2xl font-bold">{propertyData.address}</CardTitle>
                  <p className="text-muted-foreground">{propertyData.location}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                    <Image
                      src={propertyPhoto || propertyData.image}
                      alt={propertyData.address}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="col-span-2">
                    <PropertyStats property={propertyData} />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Roof Assessment</p>
                    <p className="font-medium">{new Date(propertyData.lastRoofingAssessment).toLocaleDateString()}</p>
                  </div>
                  <Button onClick={() => setIsRoofAssessmentModalOpen(true)}>
                    <HardHat className="h-4 w-4 mr-2" />
                    Request Roof Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Property Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="documents" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="history">Property History</TabsTrigger>
                    <TabsTrigger value="weather">Weather Events</TabsTrigger>
                  </TabsList>
                  <TabsContent value="documents">
                    <DocumentTimeline
                      documents={propertyData.documents}
                      onUpdate={handleDocumentUpdate}
                      onDelete={handleDocumentDelete}
                      onUpload={handleDocumentUpload}
                    />
                  </TabsContent>
                  <TabsContent value="history">
                    <PropertyHistory history={propertyData.history} />
                  </TabsContent>
                  <TabsContent value="weather">
                    <WeatherEvents events={propertyData.events} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <PropertyMap property={propertyData} />

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Insurance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InsuranceDetails propertyId={propertyData.id} />
                {propertyData.documents
                  .filter(doc => doc.category === "insurance")
                  .map(doc => (
                    <InsuranceDocumentViewer
                      key={doc.id}
                      url="/sample-insurance-policy.pdf"
                      filename={doc.name}
                    />
                  ))
                }
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RoofAssessmentModal
        open={isRoofAssessmentModalOpen}
        onOpenChange={setIsRoofAssessmentModalOpen}
        propertyAddress={propertyData.address}
        lastAssessment={propertyData.lastRoofingAssessment}
      />
    </div>
  );
}