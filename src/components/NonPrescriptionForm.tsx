
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NonPrescriptionItem } from '@/lib/types';
import { Pill, ShoppingBasket, Search } from 'lucide-react';

interface NonPrescriptionFormProps {
  onNonPrescriptionSubmit: (items: NonPrescriptionItem[]) => void;
  onBack: () => void;
  showAllItems?: boolean;
}

const NonPrescriptionForm: React.FC<NonPrescriptionFormProps> = ({ 
  onNonPrescriptionSubmit, 
  onBack,
  showAllItems = false
}) => {
  // Available non-prescription items
  const availableItems: NonPrescriptionItem[] = [
    {
      id: "np-001",
      name: "Aspirin 500mg",
      description: "Pain reliever and fever reducer",
      price: 7.95,
      weight: 50,
      dimensions: { length: 8, width: 4, height: 2 },
      category: "Pain Relief",
      image: "/lovable-uploads/b2b086eb-0602-4efc-95e8-9d58fcf897b0.png"
    },
    {
      id: "np-002",
      name: "Cold & Flu Relief",
      description: "Relieves symptoms of cold and flu",
      price: 9.95,
      weight: 75,
      dimensions: { length: 10, width: 5, height: 3 },
      category: "Cold & Flu",
      image: "/lovable-uploads/b2b086eb-0602-4efc-95e8-9d58fcf897b0.png"
    },
    {
      id: "np-003",
      name: "Vitamin C 1000mg",
      description: "Supports immune function",
      price: 12.49,
      weight: 100,
      dimensions: { length: 12, width: 6, height: 6 },
      category: "Vitamins",
      image: "/lovable-uploads/b2b086eb-0602-4efc-95e8-9d58fcf897b0.png"
    },
    {
      id: "np-004",
      name: "Sunscreen SPF 50",
      description: "Broad spectrum protection",
      price: 14.99,
      weight: 150,
      dimensions: { length: 15, width: 5, height: 3 },
      category: "Sun Care",
      image: "/lovable-uploads/b2b086eb-0602-4efc-95e8-9d58fcf897b0.png"
    },
    {
      id: "np-005",
      name: "Allergy Relief",
      description: "24-hour allergy symptom relief",
      price: 11.50,
      weight: 60,
      dimensions: { length: 9, width: 5, height: 2 },
      category: "Allergy",
      image: "/lovable-uploads/b2b086eb-0602-4efc-95e8-9d58fcf897b0.png"
    },
    {
      id: "np-006",
      name: "Probiotics",
      description: "Supports digestive health",
      price: 19.95,
      weight: 90,
      dimensions: { length: 11, width: 7, height: 4 },
      category: "Digestive Health",
      image: "/lovable-uploads/b2b086eb-0602-4efc-95e8-9d58fcf897b0.png"
    }
  ];

  const [selectedItems, setSelectedItems] = useState<NonPrescriptionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(availableItems);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (searchTerm) {
      setFilteredItems(
        availableItems.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredItems(availableItems);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Calculate cart total
    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
    setCartTotal(total);
  }, [selectedItems]);

  const handleToggleItem = (item: NonPrescriptionItem) => {
    if (selectedItems.some(i => i.id === item.id)) {
      // Remove item
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      // Add item
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const handleSubmit = () => {
    if (selectedItems.length > 0) {
      onNonPrescriptionSubmit(selectedItems);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-full mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold ml-3">Non-Prescription Items</h2>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 max-w-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{selectedItems.length} items</span>
            <Badge variant="outline" className="font-medium">{cartTotal.toFixed(2)}€</Badge>
          </div>
        </div>
        
        {/* Item Grid with all items visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredItems.map(item => {
            const isSelected = selectedItems.some(i => i.id === item.id);
            
            return (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all ${
                  isSelected ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => handleToggleItem(item)}
              >
                <CardContent className="p-4 flex flex-col">
                  <div className="flex justify-center mb-3 bg-muted/40 rounded-lg p-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-24 object-contain"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">{item.category}</Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{item.price.toFixed(2)}€</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-2 w-full">
                      <Badge className="w-full flex justify-center py-1">Selected</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
          >
            Back
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={selectedItems.length === 0}
          >
            Continue with {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NonPrescriptionForm;
