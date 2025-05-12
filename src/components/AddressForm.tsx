
import React, { useState } from 'react';
import { Address } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import MapView from './MapView';

interface AddressFormProps {
  onAddressSubmit: (address: Address) => void;
}

const europeanCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden", "United Kingdom", "Switzerland", "Norway"
];

const AddressForm: React.FC<AddressFormProps> = ({ onAddressSubmit }) => {
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
    country: 'Germany', // Default country
    coordinates: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!address.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    
    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    if (!address.country) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // For demonstration purposes, set mock coordinates
      // In a real app, this would come from a geocoding service
      const mockCoordinates = {
        lat: 48.8566 + Math.random() * 0.01,
        lng: 2.3522 + Math.random() * 0.01
      };
      
      const addressWithCoordinates = {
        ...address,
        coordinates: mockCoordinates
      };
      
      onAddressSubmit(addressWithCoordinates);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-1 order-2 md:order-1">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center w-full mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold ml-3">Delivery Address</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="Enter your street and number"
                value={address.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className={errors.street ? "border-destructive" : ""}
              />
              {errors.street && (
                <p className="text-sm text-destructive">{errors.street}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Postal code"
                  value={address.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  className={errors.postalCode ? "border-destructive" : ""}
                />
                {errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={address.country} 
                onValueChange={(value) => handleChange('country', value)}
              >
                <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {europeanCountries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full mt-6">
              Continue to Prescription
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="md:col-span-1 order-1 md:order-2 h-64 md:h-auto">
        <MapView address={address} />
      </div>
    </div>
  );
};

export default AddressForm;
