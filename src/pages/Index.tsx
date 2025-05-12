
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import StepIndicator from '@/components/StepIndicator';
import AddressForm from '@/components/AddressForm';
import PrescriptionForm from '@/components/PrescriptionForm';
import NonPrescriptionForm from '@/components/NonPrescriptionForm';
import DeliveryComparison from '@/components/DeliveryComparison';
import WelcomeScreen from '@/components/WelcomeScreen';
import { Address, Prescription, DeliveryEstimate, NonPrescriptionItem, MedicationType, AppState } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AppState>({
    currentStep: 0,  // Start with welcome screen
    medicationType: null,
    address: null,
    prescription: null,
    nonPrescriptionItems: null,
    deliveryEstimates: null,
  });

  const handleMedicationTypeSelect = (type: MedicationType) => {
    setState(prev => ({
      ...prev,
      medicationType: type,
      currentStep: 1 // Move to address step
    }));
    
    toast({
      title: `${type === 'both' ? 'Combined' : type === 'prescription' ? 'Prescription' : 'Non-prescription'} delivery selected`,
      description: "Please enter your delivery address",
    });
  };

  const handleAddressSubmit = (submittedAddress: Address) => {
    setState(prev => ({
      ...prev,
      address: submittedAddress,
      // If non-prescription type, go directly to step 3
      currentStep: prev.medicationType === 'nonPrescription' ? 3 : 2
    }));
    
    toast({
      title: "Address saved",
      description: "Your delivery address has been saved",
    });
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
      // Special logic for the medication type "both"
      if (state.medicationType === 'both') {
        // If we're at prescription step and coming back from non-prescription, go back to address
        if (state.currentStep === 2 && state.nonPrescriptionItems) {
          setState(prev => ({ ...prev, currentStep: 1 }));
        }
        // If we're at non-prescription step and coming back from prescription, go back to address
        else if (state.currentStep === 3 && state.prescription) {
          setState(prev => ({ ...prev, currentStep: 1 }));
        }
        // Normal back
        else {
          setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
        }
      } else {
        // Normal back for other medication types
        setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
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
    
    toast({
      title: "Starting over",
      description: "Your previous delivery information has been cleared",
    });
  };

  // Get the total steps based on medication type
  const getTotalSteps = () => {
    if (!state.medicationType) return 1; // Just the welcome screen
    
    // Address + Items (Prescription or Non-prescription) + Delivery Options
    return state.medicationType === 'both' ? 5 : 4;
  };

  return (
    <Layout>
      {state.currentStep > 0 && (
        <StepIndicator currentStep={state.currentStep} totalSteps={getTotalSteps()} />
      )}
      
      <div className="mt-8">
        {state.currentStep === 0 && (
          <WelcomeScreen onMedicationTypeSelect={handleMedicationTypeSelect} />
        )}
        
        {state.currentStep === 1 && (
          <AddressForm onAddressSubmit={handleAddressSubmit} />
        )}
        
        {state.currentStep === 2 && (
          (state.medicationType === 'prescription' || state.medicationType === 'both') && (
            <PrescriptionForm 
              onPrescriptionSubmit={handlePrescriptionSubmit} 
              onBack={handleBack} 
            />
          )
        )}
        
        {state.currentStep === 3 && (
          (state.medicationType === 'nonPrescription' || state.medicationType === 'both') && (
            <NonPrescriptionForm 
              onNonPrescriptionSubmit={handleNonPrescriptionSubmit} 
              onBack={handleBack} 
            />
          )
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
