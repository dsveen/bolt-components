"use client";

import { useState } from "react";
import { Document } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentCard } from "@/components/DocumentCard";
import { DocumentUploadModal } from "@/components/DocumentUploadModal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentTimelineProps {
  documents: Document[];
  onUpdate: (documentId: string, updates: Partial<Document>) => void;
  onDelete: (documentId: string) => void;
  onUpload: (document: Omit<Document, "id">) => void;
}

export function DocumentTimeline({
  documents,
  onUpdate,
  onDelete,
  onUpload,
}: DocumentTimelineProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();

  // Sort documents by start date, most recent first
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const handleUpload = (document: Omit<Document, "id">) => {
    onUpload(document);
    setIsUploadModalOpen(false);
    toast({
      title: "Document uploaded",
      description: "The document has been successfully uploaded.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {sortedDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
          {documents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No documents found. Upload a document to get started.
            </div>
          )}
        </div>
      </ScrollArea>

      <DocumentUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUpload}
      />
    </div>
  );
}