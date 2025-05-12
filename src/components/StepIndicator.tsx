
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, FileText, Clock, PackagePlus } from 'lucide-react';

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
    <div className="w-full py-6">
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
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "bg-muted border-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-center">
                    <span className={isActive ? "text-foreground" : "text-muted-foreground"}>
                      {step.name}
                    </span>
                  </div>
                </div>
                {index < displaySteps.length - 1 && (
                  <div 
                    className={cn(
                      "flex-1 border-t-2",
                      isActive && currentStep > index + 2 ? "border-primary" : "border-muted"
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
