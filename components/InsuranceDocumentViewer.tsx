"use client";

import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Maximize2 } from 'lucide-react';

interface InsuranceDocumentViewerProps {
  url: string;
  filename: string;
}

export function InsuranceDocumentViewer({ url, filename }: InsuranceDocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div 
        className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{filename}</p>
              <p className="text-sm text-muted-foreground">Insurance Policy Document</p>
            </div>
          </div>
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[800px] p-0">
          <iframe
            src={url}
            className="w-full h-full rounded-lg"
            title={filename}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}