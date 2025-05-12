
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MedicationType } from '@/lib/types';
import { PackagePlus, Pill, FileText, Search, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WelcomeScreenProps {
  onMedicationTypeSelect: (type: MedicationType) => void;
  onMedicationSearch: (query: string, isPrescription: boolean) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onMedicationTypeSelect, onMedicationSearch }) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = React.useState<MedicationType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onMedicationTypeSelect(selectedType);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const isPrescription = selectedType === 'prescription' || selectedType === 'both';
      onMedicationSearch(searchQuery, isPrescription);
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
          <h3 className="text-lg font-medium">What type of medication do you need?</h3>
          
          <RadioGroup 
            value={selectedType || ""} 
            onValueChange={(value) => setSelectedType(value as MedicationType)}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <Label 
              htmlFor="prescription" 
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value="prescription" id="prescription" className="mt-1" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Prescription Medication</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Medications that require a doctor's prescription
                </p>
              </div>
            </Label>
            
            <Label 
              htmlFor="nonPrescription"
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value="nonPrescription" id="nonPrescription" className="mt-1" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <Pill className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Non-Prescription Medication</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Over-the-counter medications and healthcare products
                </p>
              </div>
            </Label>
            
            <Label 
              htmlFor="both"
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value="both" id="both" className="mt-1" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <PackagePlus className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Both</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  I need both prescription and non-prescription items
                </p>
              </div>
            </Label>
          </RadioGroup>
          
          {selectedType && (
            <div className="mt-6 border-t pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
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
                    <Input
                      placeholder="Search for medication..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch}>Search</Button>
                  </div>
                </TabsContent>
                <TabsContent value="camera" className="mt-4">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div>
                        <img src={imagePreview} alt="Prescription" className="max-h-48 mx-auto" />
                        <Button 
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setImagePreview(null)}
                        >
                          Remove
                        </Button>
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
            </div>
          )}
          
          <div className="flex justify-between gap-4">
            <Button 
              variant="outline"
              onClick={() => onMedicationTypeSelect('nonPrescription')}
              className="flex-1"
            >
              Browse All Products
            </Button>
            
            <Button 
              onClick={handleContinue} 
              disabled={!selectedType} 
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
