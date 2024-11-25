"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface UploadingDocument {
  file: File;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
}

export function DocumentUpload() {
  const [uploadingDocs, setUploadingDocs] = useState<UploadingDocument[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocs = acceptedFiles.map(file => ({
      file,
      category: "",
      startDate: "",
      endDate: "",
      progress: 0
    }));
    setUploadingDocs(current => [...current, ...newDocs]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10485760 // 10MB
  });

  const removeFile = (index: number) => {
    setUploadingDocs(current => current.filter((_, i) => i !== index));
  };

  const handleUpload = async (doc: UploadingDocument, index: number) => {
    if (!doc.category || !doc.startDate || !doc.endDate) {
      return;
    }

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadingDocs(current =>
        current.map((d, i) =>
          i === index ? { ...d, progress } : d
        )
      );
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Remove the uploaded file from the list
    setTimeout(() => {
      removeFile(index);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-1">
          Drag & drop files here, or click to select files
        </p>
        <p className="text-xs text-muted-foreground">
          Supports: PDF, JPG, PNG (max 10MB)
        </p>
      </div>

      {uploadingDocs.length > 0 && (
        <div className="space-y-4">
          {uploadingDocs.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{doc.file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`category-${index}`}>Category</Label>
                  <Select
                    value={doc.category}
                    onValueChange={(value) =>
                      setUploadingDocs(current =>
                        current.map((d, i) =>
                          i === index ? { ...d, category: value } : d
                        )
                      )
                    }
                  >
                    <SelectTrigger id={`category-${index}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="permit">Permit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                  <Input
                    type="date"
                    id={`start-date-${index}`}
                    value={doc.startDate}
                    onChange={(e) =>
                      setUploadingDocs(current =>
                        current.map((d, i) =>
                          i === index ? { ...d, startDate: e.target.value } : d
                        )
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`end-date-${index}`}>End Date</Label>
                  <Input
                    type="date"
                    id={`end-date-${index}`}
                    value={doc.endDate}
                    onChange={(e) =>
                      setUploadingDocs(current =>
                        current.map((d, i) =>
                          i === index ? { ...d, endDate: e.target.value } : d
                        )
                      )
                    }
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    className="w-full"
                    disabled={!doc.category || !doc.startDate || !doc.endDate || doc.progress > 0}
                    onClick={() => handleUpload(doc, index)}
                  >
                    {doc.progress > 0 ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading {doc.progress}%
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </div>
              </div>

              {doc.progress > 0 && (
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${doc.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}