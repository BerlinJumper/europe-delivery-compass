
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import StepIndicator from '@/components/StepIndicator';
import AddressForm from '@/components/AddressForm';
import PrescriptionForm from '@/components/PrescriptionForm';
import DeliveryComparison from '@/components/DeliveryComparison';
import { Address, Prescription, DeliveryEstimate } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<Address | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [deliveryEstimates, setDeliveryEstimates] = useState<DeliveryEstimate[] | null>(null);

  const handleAddressSubmit = (submittedAddress: Address) => {
    setAddress(submittedAddress);
    setCurrentStep(2);
    
    toast({
      title: "Address saved",
      description: "Your delivery address has been saved",
    });
  };

  const handlePrescriptionSubmit = (submittedPrescription: Prescription) => {
    setPrescription(submittedPrescription);
    setCurrentStep(3);
    
    toast({
      title: "Calculating delivery options",
      description: "Please wait while we calculate the best delivery option",
    });
    
    // Simulate API call to calculate delivery options
    setTimeout(() => {
      // Create mock delivery estimates
      // In a real app, this would come from an API/algorithm
      const droneCost = submittedPrescription.weight * 0.02;
      const droneTime = 10 + Math.floor(Math.random() * 15);
      
      const carCost = 5 + (Math.random() * 3);
      const carTime = 30 + Math.floor(Math.random() * 45);
      
      // Weather conditions affect drone suitability
      const windSpeed = Math.floor(Math.random() * 30);
      const droneWeatherSuitable = windSpeed < 20;
      
      // Mock data for delivery estimates
      const estimates: DeliveryEstimate[] = [
        {
          method: "drone",
          time: droneTime,
          cost: droneCost,
          weatherSuitable: droneWeatherSuitable,
          recommended: droneWeatherSuitable && droneTime < carTime,
          weatherCondition: {
            temperature: 18 + Math.floor(Math.random() * 8),
            windSpeed: windSpeed,
            precipitation: Math.random() * 30,
            visibility: 80 + Math.random() * 20
          },
          distance: 2.5 + Math.random() * 1.5
        },
        {
          method: "car",
          time: carTime,
          cost: carCost,
          weatherSuitable: true, // Cars are always weather suitable
          recommended: !droneWeatherSuitable || droneTime >= carTime,
          weatherCondition: {
            temperature: 18 + Math.floor(Math.random() * 8),
            windSpeed: windSpeed,
            precipitation: Math.random() * 30,
            visibility: 80 + Math.random() * 20
          },
          distance: 5 + Math.random() * 3
        }
      ];
      
      setDeliveryEstimates(estimates);
      
      toast({
        title: "Delivery options ready",
        description: "We've calculated the best delivery options for your prescription",
      });
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setAddress(null);
    setPrescription(null);
    setDeliveryEstimates(null);
    
    toast({
      title: "Starting over",
      description: "Your previous delivery information has been cleared",
    });
  };

  return (
    <Layout>
      <StepIndicator currentStep={currentStep} totalSteps={3} />
      
      <div className="mt-8">
        {currentStep === 1 && (
          <AddressForm onAddressSubmit={handleAddressSubmit} />
        )}
        
        {currentStep === 2 && (
          <PrescriptionForm 
            onPrescriptionSubmit={handlePrescriptionSubmit} 
            onBack={handleBack} 
          />
        )}
        
        {currentStep === 3 && address && prescription && deliveryEstimates && (
          <DeliveryComparison 
            deliveryEstimates={deliveryEstimates} 
            address={address}
            prescription={prescription}
            onBack={handleBack} 
            onReset={handleReset} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
