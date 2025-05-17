
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
    
    // Set the address as valid when there's any input
    if (value.length >= 1) {
      setIsValidAddress(true);
      
      // Simple address parsing for manual input
      parseAddressInput(value);
      
      // Still show suggestions if they match
      if (value.length >= 3) {
        const filtered = mockSuggestions.filter(
          suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsValidAddress(false);
    }
  };

  // Parse manual address input
  const parseAddressInput = (input: string) => {
    // Simple address parsing - you can enhance this later with your backend
    // For now, just set the street to the full input to allow continuing
    setAddress({
      street: input,
      city: 'Unknown',
      postalCode: '',
      country: 'Germany',
      coordinates: {
        lat: 52.52 + Math.random() * 0.01, // Mock coordinates for Berlin
        lng: 13.40 + Math.random() * 0.01
      }
    });
  };

  const selectSuggestion = (suggestion: string) => {
    setSingleAddressInput(suggestion);
    setShowSuggestions(false);
    setIsValidAddress(true);
    
    // Parse the selected suggestion into address components
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
      // This is the critical part - make sure we're calling onAddressSubmit with the address
      onAddressSubmit(address);
      
      toast({
        title: "Address saved",
        description: "Your delivery address has been saved",
      });
    } else {
      toast({
        title: "Invalid address",
        description: "Please enter an address",
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
            Enter your delivery address to get started
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Address form */}
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
                    onFocus={() => singleAddressInput.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
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
                    ✓ Address accepted
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  Enter any address or select a suggestion from the dropdown
                </p>
              </div>
              
              <Button 
                onClick={handleAddressSubmit}
                className="w-full bg-[#002b5c] hover:bg-[#003d80] text-white"
                disabled={!isValidAddress}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
