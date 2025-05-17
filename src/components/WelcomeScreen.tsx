
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicationType, Address } from '@/lib/types';
import { Navigation, MapPin, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

interface WelcomeScreenProps {
  onMedicationTypeSelect: (type: MedicationType) => void;
  onMedicationSearch: (query: string, isPrescription: boolean) => void;
  onAddressSubmit: (address: Address) => void;
  defaultAddress?: Address | null;
}

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

  const [singleAddressInput, setSingleAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions - in a real app, these would come from a geocoding API
  const mockSuggestions = [
    "Friedrichstraße 123, 10117 Berlin, Germany",
    "Alexanderplatz 1, 10178 Berlin, Germany",
    "Kurfürstendamm 234, 10719 Berlin, Germany",
    "Potsdamer Platz 5, 10785 Berlin, Germany",
    "Unter den Linden 77, 10117 Berlin, Germany"
  ];

  useEffect(() => {
    // Click outside to close suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSingleAddressInput(value);
    
    // Only show suggestions when there's input and it's at least 3 characters
    if (value.length >= 3) {
      // Filter mock suggestions - in a real app, this would be an API call
      const filtered = mockSuggestions.filter(
        suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setIsValidAddress(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsValidAddress(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSingleAddressInput(suggestion);
    setShowSuggestions(false);
    setIsValidAddress(true);
    
    // Parse the selected suggestion into address components
    // In a real app, this would use a proper address parser or geocoding API
    const parts = suggestion.split(', ');
    if (parts.length >= 3) {
      const [street, cityWithPostal, country] = parts;
      const postalCodeMatch = cityWithPostal.match(/(\d+)/);
      const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
      const city = cityWithPostal.replace(postalCode, '').trim();
      
      setAddress({
        street,
        city,
        postalCode,
        country,
        coordinates: {
          lat: 52.5200 + Math.random() * 0.01, // Mock coordinates for Berlin
          lng: 13.4050 + Math.random() * 0.01
        }
      });
    }
  };

  const handleAddressSubmit = () => {
    if (isValidAddress) {
      onAddressSubmit(address);
      
      toast({
        title: "Address saved",
        description: "Your delivery address has been saved",
      });
    } else {
      toast({
        title: "Invalid address",
        description: "Please select an address from the suggestions",
        variant: "destructive"
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
                <div className="space-y-2 relative">
                  <Label htmlFor="addressInput">Enter your address</Label>
                  <div className="relative">
                    <Input
                      id="addressInput"
                      placeholder="Start typing your address..."
                      value={singleAddressInput}
                      onChange={handleInputChange}
                      onFocus={() => singleAddressInput.length >= 3 && setSuggestions.length > 0 && setShowSuggestions(true)}
                      className="pr-10"
                      ref={inputRef}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {showSuggestions && (
                    <div 
                      ref={suggestionsRef}
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {isValidAddress && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                      ✓ Valid address selected
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Please select a suggestion from the dropdown after typing
                  </p>
                </div>
                
                <Button 
                  onClick={handleAddressSubmit} 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!isValidAddress}
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
