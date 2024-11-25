"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, PencilIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

const insuranceTypes = [
  { id: "dwelling", label: "Dwelling/Property" },
  { id: "liability", label: "Liability" },
  { id: "flood", label: "Flood" },
  { id: "wind", label: "Wind/Hurricane" },
  { id: "umbrella", label: "Umbrella" },
  { id: "construction", label: "Construction" },
  { id: "condominium", label: "Condominium" },
  { id: "earthquake", label: "Earthquake" },
  { id: "other", label: "Other" },
];

interface InsuranceDetailsProps {
  propertyId: number;
}

interface InsuranceData {
  types: string[];
  carrier: string;
  policyNumber: string;
  paymentFrequency: string;
  annualPremium: string;
  renewalDate: string;
}

export function InsuranceDetails({ propertyId }: InsuranceDetailsProps) {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [insuranceData, setInsuranceData] = useState<InsuranceData>({
    types: ["dwelling", "liability"],
    carrier: "SafeGuard Insurance Co.",
    policyNumber: "POL-123456",
    paymentFrequency: "annually",
    annualPremium: "2400",
    renewalDate: "2024-12-31",
  });
  const [formData, setFormData] = useState<InsuranceData>(insuranceData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTypeChange = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter(t => t !== typeId)
        : [...prev.types, typeId],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.carrier.trim()) {
      newErrors.carrier = "Insurance carrier is required";
    }

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "Policy number is required";
    }

    if (!formData.renewalDate) {
      newErrors.renewalDate = "Renewal date is required";
    }

    if (!formData.annualPremium || isNaN(Number(formData.annualPremium))) {
      newErrors.annualPremium = "Valid annual premium is required";
    }

    if (formData.types.length === 0) {
      newErrors.types = "Select at least one insurance type";
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

    setInsuranceData(formData);
    setIsEditModalOpen(false);
    toast({
      title: "Success",
      description: "Insurance details have been updated.",
    });
  };

  const handleModalOpen = () => {
    setFormData(insuranceData);
    setErrors({});
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Policy Information</h3>
          <Button onClick={handleModalOpen} variant="outline" size="sm">
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        </div>

        <div className="grid gap-4 rounded-lg border p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Coverage Types</p>
            <div className="flex flex-wrap gap-2">
              {insuranceData.types.map((type) => (
                <div
                  key={type}
                  className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-sm"
                >
                  {insuranceTypes.find(t => t.id === type)?.label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Insurance Carrier</p>
              <p className="text-sm">{insuranceData.carrier}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
              <p className="text-sm">{insuranceData.policyNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Payment Frequency</p>
              <p className="text-sm capitalize">{insuranceData.paymentFrequency}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Annual Premium</p>
              <p className="text-sm">{formatCurrency(Number(insuranceData.annualPremium))}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Renewal Date</p>
              <p className="text-sm">{new Date(insuranceData.renewalDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Insurance Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Coverage Types</Label>
              <div className="grid grid-cols-2 gap-4">
                {insuranceTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={formData.types.includes(type.id)}
                      onCheckedChange={() => handleTypeChange(type.id)}
                    />
                    <Label htmlFor={type.id} className="text-sm font-normal">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.types && (
                <p className="text-sm text-destructive">{errors.types}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carrier">Insurance Carrier</Label>
                <Input
                  id="carrier"
                  value={formData.carrier}
                  onChange={(e) => setFormData(prev => ({ ...prev, carrier: e.target.value }))}
                  className={errors.carrier ? "border-destructive" : ""}
                />
                {errors.carrier && (
                  <p className="text-sm text-destructive">{errors.carrier}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, policyNumber: e.target.value }))}
                  className={errors.policyNumber ? "border-destructive" : ""}
                />
                {errors.policyNumber && (
                  <p className="text-sm text-destructive">{errors.policyNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                <select
                  id="paymentFrequency"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.paymentFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentFrequency: e.target.value }))}
                >
                  <option value="annually">Annually</option>
                  <option value="semi-annually">Semi-annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualPremium">Annual Premium</Label>
                <Input
                  id="annualPremium"
                  type="number"
                  value={formData.annualPremium}
                  onChange={(e) => setFormData(prev => ({ ...prev, annualPremium: e.target.value }))}
                  className={errors.annualPremium ? "border-destructive" : ""}
                />
                {errors.annualPremium && (
                  <p className="text-sm text-destructive">{errors.annualPremium}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="renewalDate">Renewal Date</Label>
                <div className="relative">
                  <Input
                    id="renewalDate"
                    type="date"
                    value={formData.renewalDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, renewalDate: e.target.value }))}
                    className={errors.renewalDate ? "border-destructive" : ""}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.renewalDate && (
                  <p className="text-sm text-destructive">{errors.renewalDate}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}