
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MedicationType } from '@/lib/types';
import { Search, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WelcomeScreenProps {
  onMedicationTypeSelect: (type: MedicationType) => void;
  onMedicationSearch: (query: string, isPrescription: boolean) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onMedicationTypeSelect, onMedicationSearch }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-full mb-6">
          <h2 className="text-2xl font-semibold text-center">Welcome to MediDelivery</h2>
        </div>
        
        <p className="text-center mb-8 text-muted-foreground">
          Fast and reliable medication delivery across Europe
        </p>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="camera" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Camera
              </TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="mt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" />
                  <Input
                    placeholder="Search for medication..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </TabsContent>
            <TabsContent value="camera" className="mt-4">
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Prescription" className="max-h-48 mx-auto" />
                    <div className="flex gap-2 justify-center mt-4">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => setImagePreview(null)}
                      >
                        Retake Photo
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          // Use the recognized medication
                          if (searchQuery) {
                            onMedicationSearch(searchQuery, true);
                          }
                        }}
                      >
                        Use This Prescription
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-2">Take a photo of your prescription</p>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageCapture}
                      className="max-w-sm mx-auto"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline"
              onClick={() => onMedicationTypeSelect('nonPrescription')}
              className="w-full max-w-xs"
            >
              Browse All Products
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
