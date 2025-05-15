
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100/20">
      <div className="container mx-auto px-4 py-8">
        <header className="w-full max-w-4xl mx-auto mb-8 text-center relative">
          <div className="absolute left-0 top-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleHomeClick}
              className="flex items-center gap-1 border-blue-300 bg-white/80 hover:bg-blue-50"
            >
              <Home className="h-4 w-4 text-blue-600" />
              <span className="hidden sm:inline text-blue-600">Home</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-blue-800">MediDelivery</h1>
          <p className="text-blue-600 mt-2">
            Prescription delivery optimization for Europe
          </p>
        </header>
        
        <main className={cn("w-full", className)}>
          {children}
        </main>
        
        <footer className="mt-20 py-6 text-center text-sm text-blue-500">
          <p>© 2025 MediDelivery - Optimized medication delivery service</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
