import React, { useState } from 'react';
import { Prescription } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PrescriptionFormProps {
  onPrescriptionSubmit: (prescription: Prescription) => void;
  onBack: () => void;
  initialData?: Prescription | null;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
  onPrescriptionSubmit,
  onBack,
  initialData
}) => {
  const { toast } = useToast();
  
  const [prescription, setPrescription] = useState<Prescription>(initialData || {
    id: `PRX-${Math.floor(Math.random() * 10000)}`,
    title: '',
    description: '',
    weight: 100, // Default weight in grams
    dimensions: {
      length: 10, // Default dimensions in cm
      width: 5,
      height: 3,
    },
    urgent: false,
    patientName: '',
    insuranceCompany: '',
    birthDate: '',
    prescriptionFee: 7.55, // Default prescription fee in Germany
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    field: keyof Prescription, 
    value: string | number | boolean
  ) => {
    setPrescription(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDimensionChange = (
    dimension: keyof Prescription['dimensions'], 
    value: string
  ) => {
    const numberValue = parseFloat(value) || 0;
    setPrescription(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: numberValue
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`dimensions.${dimension}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`dimensions.${dimension}`];
        return newErrors;
      });
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImagePreview(event.target.result);
          // In a real app, we would upload this image to a server
          // and use AI to extract prescription details
          toast({
            title: "Prescription image captured",
            description: "In a production app, this would analyze the prescription automatically",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!prescription.title.trim()) {
      newErrors.title = 'Prescription name is required';
    }
    
    if (!prescription.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Simplified validation - fewer required fields
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onPrescriptionSubmit(prescription);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold ml-3">Prescription Details</h2>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Medication Name</Label>
            <Input
              id="title"
              placeholder="Enter medication name (e.g. Ibuprofen 600mg)"
              value={prescription.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter prescription details"
              rows={3}
              value={prescription.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prescriptionFee">Prescription Fee (€)</Label>
            <Input
              id="prescriptionFee"
              type="number"
              step="0.01"
              min="0"
              value={prescription.prescriptionFee || 0}
              onChange={(e) => handleChange('prescriptionFee', parseFloat(e.target.value) || 0)}
              className={errors.prescriptionFee ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Standard prescription fee in Germany is 7,55€
            </p>
          </div>
          
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="urgent">Urgent Delivery</Label>
              <p className="text-sm text-muted-foreground">
                Mark this if the prescription is urgent
              </p>
            </div>
            <Switch
              id="urgent"
              checked={prescription.urgent}
              onCheckedChange={(checked) => handleChange('urgent', checked)}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
            >
              Back
            </Button>
            
            <Button type="submit">
              Calculate Delivery Options
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrescriptionForm;
