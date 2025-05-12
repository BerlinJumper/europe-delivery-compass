
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Address, DeliveryEstimate, Prescription, NonPrescriptionItem } from '@/lib/types';
import { Car, Clock, Wind, Thermometer, CloudRain, Eye, MapPin, Package, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface DeliveryComparisonProps {
  deliveryEstimates: DeliveryEstimate[];
  address: Address;
  prescription: Prescription | null;
  nonPrescriptionItems: NonPrescriptionItem[] | null;
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
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    navigate('/');
  };

  // Calculate total weight
  let totalWeight = 0;
  if (prescription) {
    totalWeight += prescription.weight;
  }
  if (nonPrescriptionItems && nonPrescriptionItems.length) {
    totalWeight += nonPrescriptionItems.reduce((sum, item) => sum + item.weight, 0);
  }

  // Calculate total items
  let totalItems = 0;
  if (prescription) {
    totalItems += 1;
  }
  if (nonPrescriptionItems) {
    totalItems += nonPrescriptionItems.length;
  }

  // Format address for display
  const formattedAddress = `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-full mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold ml-3">Delivery Options</h2>
        </div>

        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Delivery Address</h3>
              <p className="text-sm text-muted-foreground">{formattedAddress}</p>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {totalWeight}g
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {deliveryEstimates.map((estimate, index) => (
            <div 
              key={index}
              className={`p-4 border rounded-lg ${estimate.recommended ? 'border-primary bg-primary/5' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {estimate.method === 'drone' ? (
                    <Package className="h-6 w-6 text-primary mr-2" />
                  ) : (
                    <Car className="h-6 w-6 text-primary mr-2" />
                  )}
                  <div>
                    <h3 className="font-medium capitalize">
                      {estimate.method} Delivery
                      {estimate.recommended && (
                        <Badge className="ml-2 bg-primary/20 text-primary border-primary">
                          <Check className="h-3 w-3 mr-1" /> Recommended
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {estimate.distance?.toFixed(2)} km distance
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{estimate.cost.toFixed(2)} €</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {estimate.time} min
                  </div>
                </div>
              </div>
              
              {/* Weather conditions */}
              {estimate.weatherCondition && (
                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Weather Conditions</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-xs">{estimate.weatherCondition.temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-xs">{estimate.weatherCondition.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center">
                      <CloudRain className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-xs">{Math.round(estimate.weatherCondition.precipitation)}%</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-xs">{Math.round(estimate.weatherCondition.visibility)}%</span>
                    </div>
                  </div>
                  
                  {estimate.method === 'drone' && !estimate.weatherSuitable && (
                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                      Note: Weather conditions may affect drone delivery reliability
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
          >
            Back
          </Button>
          
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onReset}
            >
              Start Over
            </Button>
            
            <Button type="button">
              Proceed to Payment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryComparison;
