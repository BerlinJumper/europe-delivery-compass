
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MedicationType } from '@/lib/types';
import { PackagePlus, Pill, FileText } from 'lucide-react';

interface WelcomeScreenProps {
  onMedicationTypeSelect: (type: MedicationType) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onMedicationTypeSelect }) => {
  const [selectedType, setSelectedType] = React.useState<MedicationType | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onMedicationTypeSelect(selectedType);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-full mb-6">
          <h2 className="text-2xl font-semibold text-center">Welcome to MediDelivery</h2>
        </div>
        
        <p className="text-center mb-8 text-muted-foreground">
          Fast and reliable medication delivery across Europe
        </p>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium">What type of medication do you need?</h3>
          
          <RadioGroup 
            value={selectedType || ""} 
            onValueChange={(value) => setSelectedType(value as MedicationType)}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <Label 
              htmlFor="prescription" 
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value="prescription" id="prescription" className="mt-1" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Prescription Medication</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Medications that require a doctor's prescription
                </p>
              </div>
            </Label>
            
            <Label 
              htmlFor="nonPrescription"
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value="nonPrescription" id="nonPrescription" className="mt-1" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <Pill className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Non-Prescription Medication</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Over-the-counter medications and healthcare products
                </p>
              </div>
            </Label>
            
            <Label 
              htmlFor="both"
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value="both" id="both" className="mt-1" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <PackagePlus className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Both</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  I need both prescription and non-prescription items
                </p>
              </div>
            </Label>
          </RadioGroup>
          
          <Button 
            onClick={handleContinue} 
            disabled={!selectedType} 
            className="w-full mt-4"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
