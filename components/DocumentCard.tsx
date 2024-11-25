"use client";

import { useState } from "react";
import { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Download, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface DocumentCardProps {
  document: Document;
  onUpdate?: (id: string, updates: Partial<Document>) => void;
  onDelete?: (id: string) => void;
}

export function DocumentCard({ document, onUpdate, onDelete }: DocumentCardProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: document.name,
    startDate: document.startDate,
    endDate: document.endDate,
    notes: document.notes || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const now = new Date();
  const endDate = new Date(document.endDate);
  const daysUntilExpiration = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const getExpirationStatus = () => {
    if (daysUntilExpiration <= 14) {
      return {
        status: "danger",
        message: `Expires in ${daysUntilExpiration} days!`,
        className: "text-destructive"
      };
    }
    if (daysUntilExpiration <= 30) {
      return {
        status: "warning",
        message: `Expires in ${daysUntilExpiration} days`,
        className: "text-yellow-500 dark:text-yellow-400"
      };
    }
    return null;
  };

  const expirationStatus = getExpirationStatus();

  const getCategoryIcon = () => {
    switch (document.category) {
      case "insurance":
        return "🛡️";
      case "lease":
        return "📋";
      case "inspection":
        return "🔍";
      case "permit":
        return "📜";
      default:
        return "📄";
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Title is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors.",
      });
      return;
    }

    onUpdate?.(document.id, {
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes,
    });
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete?.(document.id);
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer",
          expirationStatus?.status === "danger" && "border-destructive/50",
          expirationStatus?.status === "warning" && "border-yellow-500/50 dark:border-yellow-400/50"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{getCategoryIcon()}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{document.name}</p>
              {expirationStatus && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className={cn("h-4 w-4", expirationStatus.className)} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{expirationStatus.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>{document.type}</span>
              <span>•</span>
              <span>{document.size}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Valid: {new Date(document.startDate).toLocaleDateString()} - {new Date(document.endDate).toLocaleDateString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: "" }));
                  }
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, startDate: e.target.value }));
                    if (errors.startDate) {
                      setErrors(prev => ({ ...prev, startDate: "" }));
                    }
                  }}
                  className={errors.startDate ? "border-destructive" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive mt-1">{errors.startDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, endDate: e.target.value }));
                    if (errors.endDate) {
                      setErrors(prev => ({ ...prev, endDate: "" }));
                    }
                  }}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this document..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the document.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}