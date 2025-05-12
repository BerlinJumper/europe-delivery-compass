
import React, { useState } from 'react';
import { NonPrescriptionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pill, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NonPrescriptionFormProps {
  onNonPrescriptionSubmit: (items: NonPrescriptionItem[]) => void;
  onBack: () => void;
}

const NonPrescriptionForm: React.FC<NonPrescriptionFormProps> = ({ 
  onNonPrescriptionSubmit,
  onBack
}) => {
  // Sample product catalog
  const productCatalog: NonPrescriptionItem[] = [
    {
      id: "np-001",
      name: "Vitamin D3",
      category: "Vitamins",
      price: 9.99,
      weight: 50,
      dimensions: { length: 5, width: 5, height: 10 },
      imageUrl: "https://placehold.co/100x100?text=Vitamin+D3"
    },
    {
      id: "np-002",
      name: "Pain Relief Tablets",
      category: "Pain Management",
      price: 5.49,
      weight: 30,
      dimensions: { length: 8, width: 4, height: 2 },
      imageUrl: "https://placehold.co/100x100?text=Pain+Relief"
    },
    {
      id: "np-003",
      name: "Cold & Flu Relief",
      category: "Cold & Flu",
      price: 7.99,
      weight: 80,
      dimensions: { length: 12, width: 6, height: 3 },
      imageUrl: "https://placehold.co/100x100?text=Cold+%26+Flu"
    },
    {
      id: "np-004",
      name: "Sunscreen SPF 50",
      category: "Skin Care",
      price: 12.99,
      weight: 150,
      dimensions: { length: 15, width: 5, height: 3 },
      imageUrl: "https://placehold.co/100x100?text=Sunscreen"
    },
    {
      id: "np-005",
      name: "First Aid Kit",
      category: "First Aid",
      price: 15.99,
      weight: 300,
      dimensions: { length: 20, width: 15, height: 5 },
      imageUrl: "https://placehold.co/100x100?text=First+Aid+Kit"
    },
    {
      id: "np-006",
      name: "Multivitamin Complex",
      category: "Vitamins",
      price: 11.49,
      weight: 100,
      dimensions: { length: 10, width: 6, height: 6 },
      imageUrl: "https://placehold.co/100x100?text=Multivitamin"
    }
  ];

  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(productCatalog.map(item => item.category)));
  
  const filteredProducts = activeCategory 
    ? productCatalog.filter(item => item.category === activeCategory) 
    : productCatalog;

  const addToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const getCartItems = (): NonPrescriptionItem[] => {
    return Object.entries(cart).flatMap(([id, quantity]) => {
      const item = productCatalog.find(p => p.id === id);
      if (!item) return [];
      return Array(quantity).fill(item);
    });
  };

  const cartItemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((total, [id, quantity]) => {
    const item = productCatalog.find(p => p.id === id);
    return total + (item ? item.price * quantity : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cartItems = getCartItems();
    if (cartItems.length > 0) {
      onNonPrescriptionSubmit(cartItems);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold ml-3">Non-Prescription Items</h2>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                type="button"
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  type="button"
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Badge variant="secondary" className="flex gap-1 items-center">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredProducts.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-4">
                  <img
                    src={item.imageUrl || "https://placehold.co/100x100?text=Product"}
                    alt={item.name}
                    className="mx-auto h-24 w-24 object-cover mb-4 rounded"
                  />
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-semibold">{item.price.toFixed(2)} €</span>
                    
                    {cart[item.id] ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{cart[item.id]}</span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => addToCart(item.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => addToCart(item.id)}
                      >
                        Add to cart
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-semibold">{cartTotal.toFixed(2)} €</span>
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
                type="submit" 
                disabled={cartItemCount === 0}
              >
                Continue to Delivery
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NonPrescriptionForm;
