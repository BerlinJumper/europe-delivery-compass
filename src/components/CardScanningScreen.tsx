
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CardScanningScreenProps {
  onCardSubmit: (cardDetails: any) => void;
  onBack: () => void;
}

const CardScanningScreen: React.FC<CardScanningScreenProps> = ({ onCardSubmit, onBack }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('scan');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImagePreview(event.target.result);
          toast({
            title: "Card image captured",
            description: "Analyzing card details...",
          });
          
          // Simulate card recognition
          setTimeout(() => {
            setCardNumber('123456789');
            setCardHolder('John Doe');
            setInsuranceId('AX3845792');
            toast({
              title: "Card recognized",
              description: "Card details extracted successfully",
            });
          }, 1500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'scan' && !imagePreview) {
      toast({
        title: "No card scanned",
        description: "Please scan your insurance card or enter details manually",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'manual' && (!cardNumber || !cardHolder || !insuranceId)) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all card details",
        variant: "destructive"
      });
      return;
    }
    
    // Submit the card details
    onCardSubmit({
      cardNumber,
      cardHolder,
      insuranceId,
      scanned: activeTab === 'scan'
    });
    
    toast({
      title: "Card submitted",
      description: "Your insurance card details have been processed",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-full mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-center ml-3 text-primary">
            Insurance Card
          </h2>
        </div>
        
        <p className="text-center mb-8 text-muted-foreground">
          Please scan your insurance card or enter details manually
        </p>
        
        <Tabs 
          defaultValue="scan" 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="scan">Scan Card</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan">
            <div className="space-y-6">
              {!imagePreview ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 mb-4">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Scan your insurance card</p>
                    </div>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="max-w-xs"
                    id="card-image"
                  />
                  <Label htmlFor="card-image" className="sr-only">
                    Upload insurance card
                  </Label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src={imagePreview} 
                      alt="Insurance Card" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {(cardNumber && cardHolder && insuranceId) && (
                    <div className="space-y-2 p-4 bg-slate-50 rounded-md border border-slate-200">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-500">Card Number:</div>
                        <div className="font-medium">{cardNumber}</div>
                        
                        <div className="text-slate-500">Card Holder:</div>
                        <div className="font-medium">{cardHolder}</div>
                        
                        <div className="text-slate-500">Insurance ID:</div>
                        <div className="font-medium">{insuranceId}</div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => {
                      setImagePreview(null);
                      setCardNumber('');
                      setCardHolder('');
                      setInsuranceId('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Scan Again
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="manual">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Insurance Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="Enter your card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input
                  id="cardHolder"
                  placeholder="Enter card holder name"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceId">Insurance ID</Label>
                <Input
                  id="insuranceId"
                  placeholder="Enter your insurance ID"
                  value={insuranceId}
                  onChange={(e) => setInsuranceId(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between gap-4 pt-6">
          <Button 
            variant="outline"
            onClick={onBack}
            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
          >
            Back
          </Button>
          
          <Button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardScanningScreen;
