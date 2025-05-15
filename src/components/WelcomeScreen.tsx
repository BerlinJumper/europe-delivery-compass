
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicationType, Address } from '@/lib/types';
import { Navigation, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WelcomeScreenProps {
  onMedicationTypeSelect: (type: MedicationType) => void;
  onMedicationSearch: (query: string, isPrescription: boolean) => void;
  onAddressSubmit: (address: Address) => void;
  defaultAddress?: Address | null;
}

const europeanCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden", "United Kingdom", "Switzerland", "Norway"
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onMedicationTypeSelect, 
  onMedicationSearch,
  onAddressSubmit,
  defaultAddress
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const [address, setAddress] = useState<Address>(defaultAddress || {
    street: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    coordinates: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle address selection from the map
  const handleMapAddressSelect = (mapAddress: any) => {
    // In a real implementation, this would extract address components from the Google Maps result
    console.log("Address selected from map:", mapAddress);
    // This is a simplified mock for demonstration purposes
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
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

  const handleAddressSubmit = () => {
    if (validateForm()) {
      // For demonstration purposes, set mock coordinates
      const mockCoordinates = {
        lat: 48.8566 + Math.random() * 0.01,
        lng: 2.3522 + Math.random() * 0.01
      };
      
      const addressWithCoordinates = {
        ...address,
        coordinates: mockCoordinates
      };
      
      onAddressSubmit(addressWithCoordinates);
      
      toast({
        title: "Address saved",
        description: "Your delivery address has been saved",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-full mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Navigation className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-semibold text-center ml-3 text-primary">MediDelivery</h2>
        </div>
        
        <p className="text-center mb-8 text-muted-foreground">
          Fast and reliable medication delivery across Europe
        </p>

        <div className="bg-white p-4 rounded-lg border border-blue-100 mb-6">
          <p className="text-sm text-blue-600 italic flex items-center justify-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            You only need to enter your address if it's not already in your profile
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Address form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Delivery Address
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    placeholder="Enter your street and number"
                    value={address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
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
                      onChange={(e) => handleAddressChange('city', e.target.value)}
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
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
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
                    onValueChange={(value) => handleAddressChange('country', value)}
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
                
                <Button 
                  onClick={handleAddressSubmit} 
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Continue to Card Scanning
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right side: Google Maps iframe */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-[400px] md:h-auto">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Select on Map
            </h3>
            
            <div className="w-full h-[300px] border border-slate-200 rounded-md overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5131882.799497933!2d5.979733705342818!3d51.08510257031399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a721ec2b1be6b%3A0x75e85d6b8e91e55b!2sGermany!5e0!3m2!1sen!2sus!4v1652347851925!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
                title="Google Maps"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Click on the map to select your location
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
