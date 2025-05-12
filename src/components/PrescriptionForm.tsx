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
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
  onPrescriptionSubmit,
  onBack
}) => {
  const { toast } = useToast();
  
  const [prescription, setPrescription] = useState<Prescription>({
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
    
    if (prescription.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0g';
    } else if (prescription.weight > 5000) {
      newErrors.weight = 'Weight cannot exceed 5000g (5kg)';
    }
    
    // Validate dimensions
    const { length, width, height } = prescription.dimensions;
    if (length <= 0) {
      newErrors['dimensions.length'] = 'Length must be greater than 0cm';
    }
    
    if (width <= 0) {
      newErrors['dimensions.width'] = 'Width must be greater than 0cm';
    }
    
    if (height <= 0) {
      newErrors['dimensions.height'] = 'Height must be greater than 0cm';
    }
    
    // Validate new fields
    if (!prescription.patientName?.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    if (!prescription.insuranceCompany?.trim()) {
      newErrors.insuranceCompany = 'Insurance company is required';
    }
    
    if (!prescription.birthDate?.trim()) {
      newErrors.birthDate = 'Birth date is required';
    }
    
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
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Enter prescription details</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setUseCamera(!useCamera)}
            >
              <Camera className="h-4 w-4" />
              {useCamera ? "Manual Entry" : "Use Camera"}
            </Button>
          </div>
          
          {useCamera ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Prescription" className="max-h-48 mx-auto" />
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-2">Take a photo of your prescription</p>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageCapture}
                      className="max-w-sm mx-auto"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Please ensure all text is clearly visible. You'll still need to verify details below.
              </p>
            </div>
          ) : null}
          
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              placeholder="Full name as on prescription"
              value={prescription.patientName || ''}
              onChange={(e) => handleChange('patientName', e.target.value)}
              className={errors.patientName ? "border-destructive" : ""}
            />
            {errors.patientName && (
              <p className="text-sm text-destructive">{errors.patientName}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceCompany">Insurance Company</Label>
              <Input
                id="insuranceCompany"
                placeholder="Your insurer"
                value={prescription.insuranceCompany || ''}
                onChange={(e) => handleChange('insuranceCompany', e.target.value)}
                className={errors.insuranceCompany ? "border-destructive" : ""}
              />
              {errors.insuranceCompany && (
                <p className="text-sm text-destructive">{errors.insuranceCompany}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={prescription.birthDate || ''}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className={errors.birthDate ? "border-destructive" : ""}
              />
              {errors.birthDate && (
                <p className="text-sm text-destructive">{errors.birthDate}</p>
              )}
            </div>
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
          
          <div className="space-y-2">
            <Label htmlFor="weight">Package Weight (grams)</Label>
            <Input
              id="weight"
              type="number"
              min="1"
              max="5000"
              placeholder="Weight in grams"
              value={prescription.weight}
              onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
              className={errors.weight ? "border-destructive" : ""}
            />
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight}</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                type="number"
                min="1"
                placeholder="Length"
                value={prescription.dimensions.length}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                className={errors['dimensions.length'] ? "border-destructive" : ""}
              />
              {errors['dimensions.length'] && (
                <p className="text-sm text-destructive">{errors['dimensions.length']}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width">Width (cm)</Label>
              <Input
                id="width"
                type="number"
                min="1"
                placeholder="Width"
                value={prescription.dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className={errors['dimensions.width'] ? "border-destructive" : ""}
              />
              {errors['dimensions.width'] && (
                <p className="text-sm text-destructive">{errors['dimensions.width']}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min="1"
                placeholder="Height"
                value={prescription.dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className={errors['dimensions.height'] ? "border-destructive" : ""}
              />
              {errors['dimensions.height'] && (
                <p className="text-sm text-destructive">{errors['dimensions.height']}</p>
              )}
            </div>
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
