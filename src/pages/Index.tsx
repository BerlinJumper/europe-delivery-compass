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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileText, Pill, PackagePlus } from 'lucide-react';

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

  // Store search query when user searches from welcome screen
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isFromCamera, setIsFromCamera] = useState(false);

  // Simulate default address for the user account
  const defaultAddress: Address = {
    street: "Hauptstraße 123",
    city: "Berlin",
    postalCode: "10115",
    country: "Germany"
  };

  const handleMedicationTypeSelect = (type: MedicationType) => {
    setState(prev => ({
      ...prev,
      medicationType: type,
      // Go to appropriate medication selection screen
      currentStep: type === 'prescription' || type === 'both' ? 2 : 3,
      // Use default address from account
      address: defaultAddress
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
      currentStep: 1, // Go to medication type selection
      address: defaultAddress
    }));
  };

  // Handle medication type selection after search
  const handleTypeSelectionAfterSearch = (type: MedicationType) => {
    setState(prev => ({
      ...prev,
      medicationType: type,
      currentStep: type === 'prescription' || type === 'both' ? 2 : 3,
      // Use the saved address
      address: defaultAddress
    }));

    // If user searched for a prescription and selected prescription type,
    // pre-fill the prescription data
    if (isFromCamera && (type === 'prescription' || type === 'both')) {
      setState(prev => ({
        ...prev,
        prescription: {
          id: `PRX-${Math.floor(Math.random() * 10000)}`,
          title: searchQuery || '',
          description: 'Auto-filled from prescription image',
          weight: 100,
          dimensions: {
            length: 10,
            width: 5,
            height: 3,
          },
          urgent: false,
          patientName: '',
          insuranceCompany: '',
          birthDate: '',
          prescriptionFee: 7.55,
        }
      }));
    }
    
    toast({
      title: `${type === 'both' ? 'Combined' : type === 'prescription' ? 'Prescription' : 'Non-prescription'} delivery selected`,
      description: searchQuery ? `Searching for "${searchQuery}"` : "Using your saved delivery address",
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
          setState(prev => ({ ...prev, currentStep: 0 }));
        }
        // If we're at non-prescription step and coming back from prescription, go back to address
        else if (state.currentStep === 3 && state.prescription) {
          setState(prev => ({ ...prev, currentStep: 0 }));
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
    
    // Skip address step
    return state.medicationType === 'both' ? 4 : 3;
  };

  // Render medication type selection screen after search
  const renderMedicationTypeSelection = () => {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-center mb-2">
              Select Medication Type for "{searchQuery}"
            </h3>
            
            <RadioGroup 
              onValueChange={(value) => handleTypeSelectionAfterSearch(value as MedicationType)}
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
            
            <div className="flex justify-between gap-4 pt-4">
              <Button 
                variant="outline"
                onClick={() => setState(prev => ({ ...prev, currentStep: 0 }))}
              >
                Back
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleMedicationTypeSelect('nonPrescription')}
              >
                Browse All Products
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      {state.currentStep > 0 && (
        <StepIndicator currentStep={state.currentStep} totalSteps={getTotalSteps()} />
      )}
      
      <div className="mt-8">
        {state.currentStep === 0 && (
          <WelcomeScreen 
            onMedicationTypeSelect={handleMedicationTypeSelect} 
            onMedicationSearch={handleMedicationSearch}
          />
        )}

        {state.currentStep === 1 && renderMedicationTypeSelection()}
        
        {state.currentStep === 2 && (
          (state.medicationType === 'prescription' || state.medicationType === 'both') && (
            <PrescriptionForm 
              onPrescriptionSubmit={handlePrescriptionSubmit} 
              onBack={handleBack}
              initialData={state.prescription}
            />
          )
        )}
        
        {state.currentStep === 3 && (
          (state.medicationType === 'nonPrescription' || state.medicationType === 'both') && (
            <NonPrescriptionForm 
              onNonPrescriptionSubmit={handleNonPrescriptionSubmit} 
              onBack={handleBack} 
              showAllItems={true}
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
