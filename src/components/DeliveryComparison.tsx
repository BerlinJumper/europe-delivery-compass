
import React, { useEffect, useState } from 'react';
import { Address, Prescription, DeliveryEstimate, NonPrescriptionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Car,
  Check,
  Package,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface DeliveryComparisonProps {
  deliveryEstimates: DeliveryEstimate[];
  address: Address;
  prescription?: Prescription | null;
  nonPrescriptionItems?: NonPrescriptionItem[] | null;
  onBack: () => void;
  onReset: () => void;
}

const DeliveryComparison: React.FC<DeliveryComparisonProps> = ({ 
  deliveryEstimates, 
  address,
  prescription,
  nonPrescriptionItems,
  onBack,
  onReset 
}) => {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(
    deliveryEstimates.find(est => est.recommended)?.method || null
  );
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Find recommended delivery option
  const recommendedOption = deliveryEstimates.find(est => est.recommended);
  
  // Calculate total cost
  const calculateTotalCost = (deliveryMethod: string) => {
    const deliveryCost = deliveryEstimates.find(est => est.method === deliveryMethod)?.cost || 0;
    
    let itemsCost = 0;
    
    // Add prescription fee if applicable
    if (prescription) {
      itemsCost += prescription.prescriptionFee || 0;
    }
    
    // Add non-prescription items cost if applicable
    if (nonPrescriptionItems && nonPrescriptionItems.length > 0) {
      itemsCost += nonPrescriptionItems.reduce((sum, item) => sum + item.price, 0);
    }
    
    return deliveryCost + itemsCost;
  };
  
  const handleConfirmDelivery = () => {
    if (!selectedDelivery) return;
    
    setIsConfirming(true);
    
    // Simulate API call to confirm delivery
    setTimeout(() => {
      setIsConfirmed(true);
      setIsConfirming(false);
    }, 1500);
  };
  
  const formatAddressString = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
  };

  // Get weather condition icon based on values
  const getWeatherIcon = (estimate: DeliveryEstimate) => {
    if (!estimate.weatherCondition) return null;
    
    const { windSpeed, precipitation } = estimate.weatherCondition;
    
    if (windSpeed > 25) {
      return '💨'; // Windy
    } else if (precipitation > 15) {
      return '🌧️'; // Rainy
    } else {
      return '☀️'; // Sunny
    }
  };
  
  if (isConfirmed) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Delivery Confirmed!</h2>
          <p className="text-muted-foreground mb-4">
            Your {prescription ? 'medication' : 'items'} will be delivered via {selectedDelivery} to your address
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg mb-4 text-left">
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{formatAddressString(address)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Estimated Delivery Time</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryEstimates.find(est => est.method === selectedDelivery)?.time} minutes
                </p>
              </div>
            </div>
          </div>
          
          <Button onClick={onReset} className="w-full">
            Start New Delivery Request
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-center mb-6">Delivery Options</h2>
        
        <div className="mb-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Delivery to:</p>
              <p className="text-sm text-muted-foreground">{formatAddressString(address)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Items:</p>
              <ul className="text-sm text-muted-foreground list-disc ml-4">
                {prescription && (
                  <li key={prescription.id}>{prescription.title}</li>
                )}
                {nonPrescriptionItems && nonPrescriptionItems.map((item, index) => (
                  <li key={`${item.id}-${index}`}>{item.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <RadioGroup 
          value={selectedDelivery || ""} 
          onValueChange={setSelectedDelivery}
          className="space-y-4"
        >
          {deliveryEstimates.map((estimate) => {
            const isRecommended = estimate.recommended;
            const totalCost = calculateTotalCost(estimate.method);
            
            return (
              <div key={estimate.method} className={`rounded-lg border p-4 ${isRecommended ? 'border-primary' : ''}`}>
                <div className="flex justify-between items-start">
                  <Label 
                    htmlFor={estimate.method}
                    className="flex items-start gap-2 cursor-pointer w-full"
                  >
                    <RadioGroupItem 
                      value={estimate.method} 
                      id={estimate.method}
                      className="mt-1" 
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {estimate.method === 'drone' ? (
                            <>
                              <span className="text-xl" role="img" aria-label="Drone">🚁</span>
                              <h3 className="font-medium">Drone Delivery</h3>
                            </>
                          ) : (
                            <>
                              <Car className="h-5 w-5" />
                              <h3 className="font-medium">Car Delivery</h3>
                            </>
                          )}
                          
                          {isRecommended && (
                            <Badge variant="outline" className="ml-2 border-primary text-primary">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery time</p>
                          <p className="font-medium">{estimate.time} minutes</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Distance</p>
                          <p className="font-medium">{estimate.distance?.toFixed(2) || "N/A"} km</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Weather</p>
                          <p className="font-medium flex items-center">
                            {getWeatherIcon(estimate)}
                            <span className="ml-1">
                              {estimate.weatherSuitable ? "Suitable" : "Not ideal"}
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery fee</p>
                          <p className="font-medium">€{estimate.cost.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      {estimate.method === 'drone' && !estimate.weatherSuitable && (
                        <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                          ⚠️ Weather conditions may affect drone delivery speed
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              </div>
            );
          })}
        </RadioGroup>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total Cost:</span>
            <span className="font-semibold">
              €{selectedDelivery ? calculateTotalCost(selectedDelivery).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
        <Button 
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        
        <Button 
          disabled={!selectedDelivery || isConfirming} 
          onClick={handleConfirmDelivery}
        >
          {isConfirming ? "Processing..." : "Confirm Delivery"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeliveryComparison;
