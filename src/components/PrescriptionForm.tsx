
import React, { useState } from 'react';
import { Prescription } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PrescriptionFormProps {
  onPrescriptionSubmit: (prescription: Prescription) => void;
  onBack: () => void;
  initialData?: Prescription | null;
  cardDetails: any;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
  onPrescriptionSubmit,
  onBack,
  initialData,
  cardDetails
}) => {
  const { toast } = useToast();
  
  // Create a simplified prescription based on card details
  const [prescription, setPrescription] = useState<Prescription>(initialData || {
    id: `PRX-${Math.floor(Math.random() * 10000)}`,
    title: 'Medication for ' + (cardDetails?.cardHolder || 'Patient'),
    description: 'Prescription medication associated with insurance card',
    weight: 100, // Default weight in grams
    dimensions: {
      length: 10, // Default dimensions in cm
      width: 5,
      height: 3,
    },
    urgent: false,
    patientName: cardDetails?.cardHolder || '',
    insuranceCompany: 'Auto-detected from card',
    birthDate: '',
    prescriptionFee: 7.55, // Default prescription fee in Germany
  });

  // Simulate fetching medications based on card details
  const associatedMedications = [
    { name: "Lisinopril 10mg", description: "Blood pressure medication", lastRefill: "2023-04-15" },
    { name: "Metformin 500mg", description: "Diabetes medication", lastRefill: "2023-05-22" },
    { name: "Atorvastatin 20mg", description: "Cholesterol medication", lastRefill: "2023-06-10" }
  ];

  const handleSubmit = () => {
    onPrescriptionSubmit(prescription);
    toast({
      title: "Medications confirmed",
      description: "Your associated medications have been added to your delivery",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-full mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold ml-3">Your Associated Medications</h2>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100 mb-6">
          <p className="text-center text-blue-700">
            Based on your insurance card (ID: {cardDetails?.insuranceId || 'Unknown'}), 
            the following medications are associated with your account
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {associatedMedications.map((med, index) => (
            <div 
              key={index} 
              className="p-4 bg-white rounded-md border border-slate-200 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-slate-800">{med.name}</h3>
                <p className="text-sm text-slate-500">{med.description}</p>
              </div>
              <div className="text-sm text-slate-400">
                Last refill: {med.lastRefill}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
          >
            Back
          </Button>
          
          <Button type="button" onClick={handleSubmit}>
            Confirm Medications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionForm;
