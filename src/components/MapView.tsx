
import React from 'react';
import { Address } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  address: Address;
}

const MapView: React.FC<MapViewProps> = ({ address }) => {
  // This is a placeholder map component
  // In a real app, this would integrate with a mapping service like Google Maps, Mapbox, etc.
  
  const hasValidAddress = address.street && address.city && address.country;
  
  // Generate a static map URL for demonstration purposes
  // For a real implementation, use a mapping library
  const city = encodeURIComponent(address.city || 'Europe');
  const country = encodeURIComponent(address.country || '');
  
  return (
    <Card className="w-full h-full overflow-hidden relative">
      <div className="absolute inset-0 bg-muted flex items-center justify-center">
        {hasValidAddress ? (
          <div className="relative w-full h-full bg-blue-50">
            <div 
              className="w-full h-full bg-cover bg-center opacity-70" 
              style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Map_of_Europe.svg/1200px-Map_of_Europe.svg.png')" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <MapPin size={32} className="text-primary" />
                  <div className="mt-1 bg-background text-xs px-2 py-1 rounded shadow-md">
                    {address.city}, {address.country}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Enter your address to see the map</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapView;
