
import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <header className="w-full max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold">MediDelivery</h1>
          <p className="text-muted-foreground mt-2">
            Prescription delivery optimization for Europe
          </p>
        </header>
        
        <main className={cn("w-full", className)}>
          {children}
        </main>
        
        <footer className="mt-20 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 MediDelivery - Optimized medication delivery service</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
