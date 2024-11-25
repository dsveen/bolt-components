"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, HardHat } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RoofAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyAddress: string;
  lastAssessment: string;
}

export function RoofAssessmentModal({
  open,
  onOpenChange,
  propertyAddress,
  lastAssessment
}: RoofAssessmentModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    preferredDate: "",
    alternativeDate: "",
    notes: "",
    contactPhone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred date is required";
    } else if (new Date(formData.preferredDate) < new Date()) {
      newErrors.preferredDate = "Date must be in the future";
    }

    if (formData.alternativeDate && new Date(formData.alternativeDate) < new Date()) {
      newErrors.alternativeDate = "Date must be in the future";
    }

    if (!formData.contactPhone) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!/^\+?\d{10,}$/.test(formData.contactPhone.replace(/[\s-]/g, ''))) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors.",
      });
      return;
    }

    // Here you would typically make an API call to schedule the assessment
    console.log('Scheduling roof assessment:', formData);

    toast({
      title: "Assessment Scheduled",
      description: "Your roof assessment request has been submitted successfully.",
    });

    onOpenChange(false);
    setFormData({
      preferredDate: "",
      alternativeDate: "",
      notes: "",
      contactPhone: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardHat className="h-5 w-5" />
            Request Roof Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">Property Address:</p>
            <p className="font-medium">{propertyAddress}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">Last Assessment:</p>
            <p className="font-medium">{new Date(lastAssessment).toLocaleDateString()}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <div className="relative">
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                  className={errors.preferredDate ? "border-destructive" : ""}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.preferredDate && (
                <p className="text-sm text-destructive">{errors.preferredDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternativeDate">Alternative Date (Optional)</Label>
              <div className="relative">
                <Input
                  id="alternativeDate"
                  type="date"
                  value={formData.alternativeDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, alternativeDate: e.target.value }))}
                  className={errors.alternativeDate ? "border-destructive" : ""}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.alternativeDate && (
                <p className="text-sm text-destructive">{errors.alternativeDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone Number</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className={errors.contactPhone ? "border-destructive" : ""}
                placeholder="+1 (555) 123-4567"
              />
              {errors.contactPhone && (
                <p className="text-sm text-destructive">{errors.contactPhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any specific concerns or access instructions..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Schedule Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}