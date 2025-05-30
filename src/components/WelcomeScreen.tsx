import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicationType, Address } from '@/lib/types';
import { Navigation, MapPin, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { usePlacesWidget } from "react-google-autocomplete";

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
  
  // Using API key from environment variables
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  const [address, setAddress] = useState<Address>(defaultAddress || {
    street: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    coordinates: undefined
  });

  const [singleAddressInput, setSingleAddressInput] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  
  // Google Places Autocomplete integration
  const { ref: googleAutocompleteInputRef } = usePlacesWidget({
    apiKey: GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      var lat = place.geometry?.location.lat();
      var lon = place.geometry?.location.lng();
      setLat(lat);
      setLon(lon);
      console.log("Place selected:", lat, lon);
      
      // Extract address components from the Google Place result
      if (place && place.address_components) {
        let newAddress: Address = {
          street: '',
          city: '',
          postalCode: '',
          country: 'Germany',
          coordinates: undefined
        };
        
        // Set coordinates if available
        if (place.geometry?.location) {
          newAddress.coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
        }
        
        // Process address components
        place.address_components.forEach((component: any) => {
          const types = component.types;
          
          if (types.includes('street_number') || types.includes('route')) {
            // Build the street address
            if (types.includes('street_number')) {
              newAddress.street = component.long_name + ' ' + (newAddress.street || '');
            } else if (types.includes('route')) {
              newAddress.street = (newAddress.street || '') + component.long_name;
            }
          }
          
          if (types.includes('locality') || types.includes('sublocality')) {
            newAddress.city = component.long_name;
          }
          
          if (types.includes('postal_code')) {
            newAddress.postalCode = component.long_name;
          }
          
          if (types.includes('country')) {
            newAddress.country = component.long_name;
          }
        });
        
        // Update the address state
        setAddress(newAddress);
        
        // Update the single input for display
        setSingleAddressInput(place.formatted_address || '');
        
        // Mark as valid address
        setIsValidAddress(true);
      }
    },
    options: {
      types: ["address"], // Restrict to address types
      componentRestrictions: { country: "de" }, // Example: Restrict to Germany, can be changed or removed
    },
  });

  const fetchDeliveryOptionsFromBackend = async (lat: number, lon: number) => {
    const backendUrl = `https://europe-west10-cassini-hackathon-460110.cloudfunctions.net/get_user_location?lat=${lat}&lon=${lon}`;
    console.log("Calling backend:", backendUrl); // For debugging

    try {
      const response = await fetch(backendUrl);
      
      if (!response.ok) {
        let errorPayload: any = { message: `Backend request failed with status ${response.status}` };
        try {
          // Try to parse as JSON, as many APIs return structured errors
          errorPayload = await response.json();
        } catch (e) {
          // If not JSON, use the text content
          errorPayload.rawText = await response.text();
        }
        console.error("Backend error response:", errorPayload);
        throw new Error(errorPayload.message || `Backend request failed: ${errorPayload.rawText || response.statusText}`);
      }
      
      const data = await response.json(); // Assuming backend returns JSON
      console.log("Backend response data:", data);
      return data; // This will likely be the array of DeliveryEstimate
    } catch (error) {
      console.error("Failed to fetch delivery options:", error);
      
      // Generate fallback mock data instead of throwing the error
      console.log("Generating fallback delivery data");
      const windSpeed = Math.floor(Math.random() * 30);
      const droneDistance = parseFloat((2.5 + Math.random() * 1.5).toFixed(2));
      const carDistance = parseFloat((5 + Math.random() * 3).toFixed(2));
      
      // Mock fallback data
      return [
        {
          method: "drone",
          time: 15 + Math.floor(Math.random() * 10),
          cost: 8.5 + Math.random() * 2,
          weatherSuitable: windSpeed < 20,
          recommended: windSpeed < 20,
          weatherCondition: {
            temperature: 18 + Math.floor(Math.random() * 8),
            windSpeed: windSpeed,
            precipitation: Math.random() * 30,
            visibility: 80 + Math.random() * 20
          },
          distance: droneDistance
        },
        {
          method: "car",
          time: 45 + Math.floor(Math.random() * 15),
          cost: 5 + Math.random() * 1.5,
          weatherSuitable: true,
          recommended: windSpeed >= 20,
          weatherCondition: {
            temperature: 18 + Math.floor(Math.random() * 8),
            windSpeed: windSpeed,
            precipitation: Math.random() * 30,
            visibility: 80 + Math.random() * 20
          },
          distance: carDistance
        }
      ];
    }
  };

  const handleAddressSubmit = async () => {
    if (isValidAddress && address.coordinates) {
      setIsLoading(true);
      toast({
        title: "Processing Address",
        description: "Please wait...",
      });
      try {
        const deliveryDataFromBackend = await fetchDeliveryOptionsFromBackend(
          lat,
          lon
        );
        
        console.log("Simulated backend call successful, data (if any):", deliveryDataFromBackend);
        
        // Only pass the address to onAddressSubmit
        onAddressSubmit(address);
        
        toast({
          title: "Address Confirmed",
          description: "Proceeding to the next step.",
        });
        
      } catch (error) {
        console.error("Error during backend call, but address is valid:", error);
        toast({
          title: "Address Confirmed (Backend Note)",
          description: "Proceeding, but there was an issue communicating with delivery service. Please check console.",
        });
        // Still proceed with the confirmed address for the frontend flow
        onAddressSubmit(address);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Invalid Address or Missing Coordinates",
        description: "Please select a valid address from the suggestions.",
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
                      onChange={(e) => setSingleAddressInput(e.target.value)}
                      className="pr-10"
                      ref={googleAutocompleteInputRef}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {isValidAddress && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                      ✓ Valid address selected
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Start typing and select an address suggestion from the dropdown
                  </p>
                </div>
                
                <Button 
                  onClick={handleAddressSubmit} 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!isValidAddress || isLoading}
                >
                  {isLoading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right side: Google Maps iframe */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-[400px] md:h-auto">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Delivery Address
            </h3>
            
            <div className="w-full h-[300px] border border-slate-200 rounded-md overflow-hidden">
              <iframe 
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=Germany`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                // onLoad={() => setMapLoaded(true)}
                title="Google Maps"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
