import React, { useState } from 'react';
import Layout from '@/components/Layout';
import StepIndicator from '@/components/StepIndicator';
import PrescriptionForm from '@/components/PrescriptionForm';
import NonPrescriptionForm from '@/components/NonPrescriptionForm';
import DeliveryComparison from '@/components/DeliveryComparison';
import WelcomeScreen from '@/components/WelcomeScreen';
import CardScanningScreen from '@/components/CardScanningScreen';
import DeliveryAddressDisplay from '@/components/DeliveryAddressDisplay';
import { Address, Prescription, DeliveryEstimate, NonPrescriptionItem, MedicationType, AppState } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileText, Pill, PackagePlus } from 'lucide-react';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AppState>({
    currentStep: 0,  // Start with welcome screen for address entry
    medicationType: null,
    address: null,
    prescription: null,
    nonPrescriptionItems: null,
    deliveryEstimates: null,
  });

  // Store search query when user searches from welcome screen
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isFromCamera, setIsFromCamera] = useState(false);
  
  // Store card details from card scanning screen
  const [cardDetails, setCardDetails] = useState<any>(null);

  // Simulate default address for the user account - now we'll start with null
  const defaultAddress: Address | null = null;

  const handleAddressSubmit = (submittedAddress: Address, deliveryData?: DeliveryEstimate[]) => {
    setState(prev => ({
      ...prev,
      address: submittedAddress,
      deliveryEstimates: deliveryData || null, // Store delivery estimates
      currentStep: deliveryData ? 4 : 1, // Go directly to Delivery Comparison if we have data, otherwise continue normal flow
      prescription: deliveryData ? null : prev.prescription, 
      nonPrescriptionItems: deliveryData ? null : prev.nonPrescriptionItems,
      medicationType: deliveryData ? null : prev.medicationType,
    }));

    if (deliveryData) {
      toast({
        title: "Delivery Options Ready",
        description: "Review your delivery options.",
      });
    } else {
      toast({
        title: "Address Saved",
        description: "Please continue with your insurance card.",
      });
    }
  };

  const handleCardSubmit = (submittedCardDetails: any) => {
    setCardDetails(submittedCardDetails);
    setState(prev => ({
      ...prev,
      // Skip medication type selection, go directly to medication display
      currentStep: 2
    }));
    
    toast({
      title: "Card processed",
      description: "Your insurance card details have been processed successfully",
    });
  };

  const handleMedicationTypeSelect = (type: MedicationType) => {
    setState(prev => ({
      ...prev,
      medicationType: type,
      // Go to appropriate medication selection screen
      currentStep: type === 'prescription' || type === 'both' ? 2 : 3,
    }));
    
    toast({
      title: `${type === 'both' ? 'Combined' : type === 'prescription' ? 'Prescription' : 'Non-prescription'} delivery selected`,
      description: "Using your saved delivery address",
    });
  };

  const handleMedicationSearch = (query: string, isPrescription: boolean) => {
    setSearchQuery(query);
    setIsFromCamera(isPrescription);
    
    // Move to medication type selection step
    setState(prev => ({
      ...prev,
      currentStep: 1, // Go to card scanning
    }));
  };

  const handlePrescriptionSubmit = (submittedPrescription: Prescription) => {
    setState(prev => ({
      ...prev,
      prescription: submittedPrescription,
      // If both types were selected and we just finished prescription, go to non-prescription
      // Otherwise, go to delivery options
      currentStep: prev.medicationType === 'both' && !prev.nonPrescriptionItems ? 3 : 4
    }));
    
    // If this completes the items selection, calculate delivery
    if (state.medicationType !== 'both' || state.nonPrescriptionItems) {
      calculateDeliveryOptions(submittedPrescription, state.nonPrescriptionItems);
    } else {
      toast({
        title: "Prescription saved",
        description: "Now add non-prescription items to your order",
      });
    }
  };

  const handleNonPrescriptionSubmit = (items: NonPrescriptionItem[]) => {
    setState(prev => ({
      ...prev,
      nonPrescriptionItems: items,
      // If both types were selected and we just finished non-prescription, 
      // go to prescription if we haven't done it yet, otherwise delivery options
      currentStep: prev.medicationType === 'both' && !prev.prescription ? 2 : 4
    }));
    
    // If this completes the items selection, calculate delivery
    if (state.medicationType !== 'both' || state.prescription) {
      calculateDeliveryOptions(state.prescription, items);
    } else {
      toast({
        title: "Items saved",
        description: "Now add your prescription details",
      });
    }
  };

  const calculateDeliveryOptions = (
    prescription: Prescription | null,
    nonPrescriptionItems: NonPrescriptionItem[] | null
  ) => {
    toast({
      title: "Calculating delivery options",
      description: "Please wait while we calculate the best delivery option",
    });
    
    // Simulate API call to calculate delivery options
    setTimeout(() => {
      // Calculate weight for delivery calculations
      let totalWeight = 0;
      if (prescription) {
        totalWeight += prescription.weight;
      }
      if (nonPrescriptionItems && nonPrescriptionItems.length) {
        totalWeight += nonPrescriptionItems.reduce((sum, item) => sum + item.weight, 0);
      }
      
      // Calculate total package size
      let maxDimensions = { length: 0, width: 0, height: 0 };
      
      if (prescription) {
        maxDimensions = { ...prescription.dimensions };
      }
      
      if (nonPrescriptionItems && nonPrescriptionItems.length) {
        nonPrescriptionItems.forEach(item => {
          maxDimensions.length = Math.max(maxDimensions.length, item.dimensions.length);
          maxDimensions.width = Math.max(maxDimensions.width, item.dimensions.width);
          maxDimensions.height = Math.max(maxDimensions.height, item.dimensions.height);
        });
      }
      
      const packageUrgent = prescription?.urgent || false;
      
      // Create mock delivery estimates based on the items
      const droneCost = totalWeight * 0.02 + (packageUrgent ? 5 : 0);
      const droneTime = 10 + Math.floor(Math.random() * 15) - (packageUrgent ? 5 : 0);
      
      const carCost = 5 + (Math.random() * 3) - (totalWeight > 1000 ? 0 : 1);
      const carTime = 30 + Math.floor(Math.random() * 45);
      
      // Weather conditions affect drone suitability
      const windSpeed = Math.floor(Math.random() * 30);
      const droneWeatherSuitable = windSpeed < 20;
      
      // Generate distances and round to 2 decimal places
      const droneDistance = parseFloat((2.5 + Math.random() * 1.5).toFixed(2));
      const carDistance = parseFloat((5 + Math.random() * 3).toFixed(2));
      
      // Mock data for delivery estimates
      const estimates: DeliveryEstimate[] = [
        {
          method: "drone",
          time: droneTime,
          cost: droneCost,
          weatherSuitable: droneWeatherSuitable,
          recommended: droneWeatherSuitable && droneTime < carTime && totalWeight < 2000,
          weatherCondition: {
            temperature: 18 + Math.floor(Math.random() * 8),
            windSpeed: windSpeed,
            precipitation: Math.random() * 30,
            visibility: 80 + Math.random() * 20
          },
          distance: droneDistance
        },
        {
          method: "car",
          time: carTime,
          cost: carCost,
          weatherSuitable: true, // Cars are always weather suitable
          recommended: !droneWeatherSuitable || droneTime >= carTime || totalWeight >= 2000,
          weatherCondition: {
            temperature: 18 + Math.floor(Math.random() * 8),
            windSpeed: windSpeed,
            precipitation: Math.random() * 30,
            visibility: 80 + Math.random() * 20
          },
          distance: carDistance
        }
      ];
      
      setState(prev => ({
        ...prev,
        deliveryEstimates: estimates,
        currentStep: 4
      }));
      
      toast({
        title: "Delivery options ready",
        description: "We've calculated the best delivery options for your order",
      });
    }, 1500);
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      // For card scanning screen, go back to address entry
      if (state.currentStep === 1) {
        setState(prev => ({ ...prev, currentStep: 0 }));
      }
      // For prescription screen, go back to card scanning
      else if (state.currentStep === 2) {
        setState(prev => ({ ...prev, currentStep: 1 }));
      }
      // For non-prescription, go back to prescription or card scanning
      else if (state.currentStep === 3) {
        setState(prev => ({ ...prev, currentStep: state.prescription ? 2 : 1 }));
      }
      // For delivery options, go back based on the previous screen
      else if (state.currentStep === 4) {
        if (state.nonPrescriptionItems) {
          setState(prev => ({ ...prev, currentStep: 3 }));
        } else {
          setState(prev => ({ ...prev, currentStep: 2 }));
        }
      }
    }
  };

  const handleReset = () => {
    setState({
      currentStep: 0,
      medicationType: null,
      address: null,
      prescription: null,
      nonPrescriptionItems: null,
      deliveryEstimates: null,
    });
    setCardDetails(null);
    
    toast({
      title: "Starting over",
      description: "Your previous delivery information has been cleared",
    });
  };

  // Get the total steps based on the flow
  const getTotalSteps = () => {
    return 3; // Address → Card Scanning → Medications → Delivery Options
  };

  return (
    <Layout>
      {state.currentStep > 0 && (
        <StepIndicator currentStep={state.currentStep} totalSteps={getTotalSteps()} />
      )}
      
      <div className="mt-8 max-w-4xl mx-auto">
        {state.currentStep === 0 && (
          <WelcomeScreen 
            onMedicationTypeSelect={handleMedicationTypeSelect}
            onMedicationSearch={handleMedicationSearch}
            onAddressSubmit={handleAddressSubmit}
            defaultAddress={defaultAddress}
          />
        )}

        {state.currentStep === 1 && state.address && (
          <>
            <DeliveryAddressDisplay address={state.address} />
            <CardScanningScreen 
              onCardSubmit={handleCardSubmit}
              onBack={handleBack}
            />
          </>
        )}
        
        {state.currentStep === 2 && state.address && cardDetails && (
          <>
            <DeliveryAddressDisplay address={state.address} />
            <PrescriptionForm 
              onPrescriptionSubmit={handlePrescriptionSubmit} 
              onBack={handleBack}
              initialData={state.prescription}
              cardDetails={cardDetails}
            />
          </>
        )}
        
        {state.currentStep === 3 && (
          <>
            {state.address && <DeliveryAddressDisplay address={state.address} />}
            <NonPrescriptionForm 
              onNonPrescriptionSubmit={handleNonPrescriptionSubmit} 
              onBack={handleBack} 
              showAllItems={true}
            />
          </>
        )}
        
        {state.currentStep === 4 && state.address && state.deliveryEstimates && (
          <DeliveryComparison 
            deliveryEstimates={state.deliveryEstimates} 
            address={state.address}
            prescription={state.prescription}
            nonPrescriptionItems={state.nonPrescriptionItems}
            onBack={handleBack} 
            onReset={handleReset} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
