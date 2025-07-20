"use client";

import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Eye, 
  Upload,
  Check,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepNavigationProps {
  steps: string[];
  currentStep: number;
  onStepChange: (step: number) => void;
  canProceed?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function StepNavigation({
  steps,
  currentStep,
  onStepChange,
  canProceed = true,
  onNext,
  onPrevious,
}: StepNavigationProps) {
  const getStepIcon = (step: string, index: number) => {
    switch (step.toLowerCase()) {
      case 'generate':
        return <Sparkles className="w-4 h-4" />;
      case 'review':
        return <Eye className="w-4 h-4" />;
      case 'publish':
        return <Upload className="w-4 h-4" />;
      default:
        return <span className="w-4 h-4 text-xs font-bold">{index + 1}</span>;
    }
  };

  const getStepLabel = (step: string) => {
    switch (step.toLowerCase()) {
      case 'generate':
        return 'Generate';
      case 'review':
        return 'Review';
      case 'publish':
        return 'Publish';
      default:
        return step;
    }
  };

  const getStepDescription = (step: string) => {
    switch (step.toLowerCase()) {
      case 'generate':
        return 'Create your form with smart assistance';
      case 'review':
        return 'Preview and customize your form';
      case 'publish':
        return 'Deploy and share your form';
      default:
        return '';
    }
  };

  const isStepCompleted = (index: number) => currentStep > index;
  const isStepAccessible = (index: number) => currentStep >= index - 1;

  return (
    <div className="w-full">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 md:gap-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Form Generator</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Create professional forms in minutes</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs md:text-sm font-medium text-gray-700">Step {currentStep + 1} of {steps.length}</div>
              <div className="text-xs text-gray-500">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</div>
            </div>
            <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-lg">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 md:h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Mobile: Only show current step, progress, and navigation */}
      <div className="md:hidden mb-8">
        <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
            {getStepIcon(steps[currentStep], currentStep)}
          </div>
          <div className="text-base font-semibold text-gray-900 mb-1">{getStepLabel(steps[currentStep])}</div>
          <div className="text-sm text-gray-500 mb-2">{getStepDescription(steps[currentStep])}</div>
          <div className="text-xs font-medium text-gray-600 mb-2">Step {currentStep + 1} of {steps.length}</div>
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              {currentStep === steps.length - 1 ? 'Publish Now' : 'Next'}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: Full step navigation */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-row items-center justify-between gap-0">
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = isStepCompleted(index);
              const isAccessible = isStepAccessible(index);

              return (
                <div key={step} className="flex flex-row items-center flex-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 h-20 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 ease-in-out relative group",
                      isActive && "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg scale-105",
                      isCompleted && "bg-green-50 border-2 border-green-300",
                      !isActive && !isCompleted && isAccessible && "hover:bg-gray-50 border-2 border-transparent hover:scale-105",
                      !isAccessible && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => isAccessible && onStepChange(index)}
                    disabled={!isAccessible}
                  >
                    {/* Step Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive && "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110",
                      isCompleted && "bg-green-500 text-white",
                      !isActive && !isCompleted && "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                    )}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        getStepIcon(step, index)
                      )}
                    </div>

                    {/* Step Label */}
                    <span className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isActive && "text-blue-700 font-semibold",
                      isCompleted && "text-green-700",
                      !isActive && !isCompleted && "text-gray-600 group-hover:text-gray-800"
                    )}>
                      {getStepLabel(step)}
                    </span>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"></div>
                    )}
                  </Button>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="flex items-center px-4">
                      <div className={cn(
                        "w-12 h-1 transition-all duration-300 rounded-full",
                        isCompleted ? "bg-green-300" : "bg-gray-200"
                      )}></div>
                      <ChevronRight className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isCompleted ? "text-green-400" : "text-gray-300"
                      )} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Description */}
          <div className="mt-6 text-center">
            <p className="text-lg font-medium text-gray-800">
              {getStepDescription(steps[currentStep])}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="px-6 py-3"
          >
            Previous
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </span>
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              {currentStep === steps.length - 1 ? 'Publish Now' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
