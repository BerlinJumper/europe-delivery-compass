
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicationType, Address } from '@/lib/types';
import { Search, Camera, Navigation } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  
  const [address, setAddress] = useState<Address>(defaultAddress || {
    street: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    coordinates: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // We don't know if it's prescription yet, so default to non-prescription
      // The type will be selected in a later step
      onMedicationSearch(searchQuery, false);
    } else {
      toast({
        title: "Search query empty",
        description: "Please enter a medication name to search",
        variant: "destructive"
      });
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImagePreview(event.target.result);
          toast({
            title: "Prescription image captured",
            description: "Analyzing prescription details...",
          });
          
          // Simulate prescription recognition
          setTimeout(() => {
            setSearchQuery("Ibuprofen 600mg");
            toast({
              title: "Prescription recognized",
              description: "Found: Ibuprofen 600mg",
            });
          }, 1500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
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
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Navigation className="h-5 w-5 mr-2 text-primary" />
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
                Continue to Medication Search
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
