
import React, { useState, useEffect, useRef } from 'react';
import { Address } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import MapView from './MapView';
import { useToast } from '@/components/ui/use-toast';

interface AddressFormProps {
  onAddressSubmit: (address: Address) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressSubmit }) => {
  const { toast } = useToast();
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
    country: 'Germany', // Default country
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValidAddress) {
      onAddressSubmit(address);
      
      toast({
        title: "Address submitted",
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
              type="submit" 
              className="w-full mt-6"
              disabled={!isValidAddress}
            >
              Continue
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
