
import React from 'react';
import { DeliveryEstimate, Address, Prescription } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Check, X, Plane, Car, Wind, Thermometer, Euro } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveryComparisonProps {
  deliveryEstimates: DeliveryEstimate[];
  address: Address;
  prescription: Prescription;
  onBack: () => void;
  onReset: () => void;
}

const DeliveryComparison: React.FC<DeliveryComparisonProps> = ({
  deliveryEstimates,
  address,
  prescription,
  onBack,
  onReset,
}) => {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
    }
  };

  const formatCost = (euros: number): string => {
    return `€${euros.toFixed(2)}`;
  };

  const getDeliveryIcon = (method: "drone" | "car") => {
    return method === "drone" ? (
      <Plane className="h-5 w-5" />
    ) : (
      <Car className="h-5 w-5" />
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-xl flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliveryEstimates.map((estimate, index) => {
              const isRecommended = estimate.recommended;
              
              return (
                <Card 
                  key={index}
                  className={cn(
                    "border-2 transition-all duration-200 relative overflow-hidden",
                    isRecommended ? `border-delivery-${estimate.method} shadow-lg` : "border-border"
                  )}
                >
                  {isRecommended && (
                    <div className="absolute top-0 right-0">
                      <div className={`bg-delivery-${estimate.method} text-white text-xs py-1 px-3 rounded-bl-md`}>
                        Recommended
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className={cn(
                    "pb-2",
                    `bg-delivery-${estimate.method}/10`
                  )}>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={cn(
                          "p-2 rounded-full mr-2",
                          `bg-delivery-${estimate.method}/20 text-delivery-${estimate.method}`
                        )}>
                          {getDeliveryIcon(estimate.method)}
                        </div>
                        <span className="capitalize">{estimate.method} Delivery</span>
                      </div>
                      
                      {estimate.weatherSuitable ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          <Check className="h-3 w-3 mr-1" /> Suitable
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                          <X className="h-3 w-3 mr-1" /> Weather Issues
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Delivery Time</span>
                        <span className="text-lg font-semibold">{formatTime(estimate.time)}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Cost</span>
                        <span className="text-lg font-semibold">{formatCost(estimate.cost)}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <span className="font-medium">{estimate.distance} km</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Weather</span>
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span>{estimate.weatherCondition?.temperature}°C</span>
                          <Wind className="h-4 w-4 text-muted-foreground" />
                          <span>{estimate.weatherCondition?.windSpeed} km/h</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className={cn(
                      "w-full mt-4",
                      isRecommended 
                        ? estimate.method === "drone" 
                          ? "bg-delivery-drone hover:bg-delivery-drone/90" 
                          : "bg-delivery-car hover:bg-delivery-car/90"
                        : "bg-muted text-muted-foreground hover:bg-muted/90"
                    )}>
                      {isRecommended ? "Select This Option" : "Choose Anyway"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Delivery Address:</p>
                <p className="font-medium">{address.street}</p>
                <p className="font-medium">
                  {address.postalCode} {address.city}, {address.country}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Prescription:</p>
                <p className="font-medium">{prescription.title}</p>
                <p className="text-sm">{prescription.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>{prescription.weight}g</span>
                  <span>
                    {prescription.dimensions.length}×
                    {prescription.dimensions.width}×
                    {prescription.dimensions.height} cm
                  </span>
                  {prescription.urgent && (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
            >
              Back
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onReset}
            >
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryComparison;
