
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, FileText, Clock, PackagePlus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { name: "Prescription", icon: FileText },
    { name: "Products", icon: PackagePlus },
    { name: "Delivery", icon: Clock },
  ];

  // Adjust steps based on total steps
  const displaySteps = totalSteps === 4 ? steps : steps.filter((_, index) => index !== 1);

  return (
    <div className="w-full py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
          onClick={() => window.location.href = '/'}
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="w-full max-w-3xl flex items-center">
          {displaySteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep >= index + 2; // +2 because currentStep starts at 2 now (after welcome/address)
            const isCompleted = currentStep > index + 2;
            
            return (
              <React.Fragment key={index}>
                <div className="relative flex flex-col items-center">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center z-10 border-2",
                      isActive 
                        ? "bg-slate-700 border-slate-700 text-white" 
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-center">
                    <span className={isActive ? "text-slate-800" : "text-slate-400"}>
                      {step.name}
                    </span>
                  </div>
                </div>
                {index < displaySteps.length - 1 && (
                  <div 
                    className={cn(
                      "flex-1 border-t-2",
                      isActive && currentStep > index + 2 ? "border-slate-600" : "border-slate-200"
                    )} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
