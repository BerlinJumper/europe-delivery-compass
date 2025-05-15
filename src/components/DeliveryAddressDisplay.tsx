
import React from 'react';
import { Address } from '@/lib/types';
import { Navigation } from 'lucide-react';

interface DeliveryAddressDisplayProps {
  address: Address;
}

const DeliveryAddressDisplay: React.FC<DeliveryAddressDisplayProps> = ({ address }) => {
  return (
    <div className="flex items-center justify-center p-2 bg-white rounded-lg border border-blue-100 mb-4 shadow-sm">
      <Navigation className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
      <p className="text-sm text-muted-foreground truncate">
        Delivering to: {address.street}, {address.city}, {address.postalCode}, {address.country}
      </p>
    </div>
  );
};

export default DeliveryAddressDisplay;
