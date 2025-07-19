"use client";

import FormGeneratorStep from "@/components/form-generator/form-generator-step";
import PublishStep from "@/components/form-generator/publish-step";
import ReviewStep from "@/components/form-generator/review-step";
import StepNavigation from "@/components/form-generator/step-navigation";
import { useState, useRef } from "react";
import { 
  Sparkles,
  Eye,
  Upload,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [canProceed, setCanProceed] = useState(true); // Start with true for first step
  const steps = ["generate", "review", "publish"];
  const publishStepRef = useRef<{ saveToDatabase: () => Promise<void> } | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCanProceed(false);
    } else if (currentStep === steps.length - 1) {
      // This is the publish step, trigger the publish function
      if (publishStepRef.current?.saveToDatabase) {
        publishStepRef.current.saveToDatabase();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCanProceed(true);
    }
  };

  const handleStepChange = (step: number) => {
    // Allow going back or to completed steps
    if (step <= currentStep) {
      setCurrentStep(step);
      setCanProceed(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Form Generator</h1>
                <p className="text-gray-600 mt-1">Create professional forms with intelligent assistance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Smart Builder</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <StepNavigation
            steps={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            canProceed={canProceed}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        {/* Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {currentStep === 0 && (
              <FormGeneratorStep 
                onComplete={() => setCanProceed(true)}
                onIncomplete={() => setCanProceed(false)}
              />
            )}
            {currentStep === 1 && (
              <ReviewStep 
                setCurrentStep={setCurrentStep}
                onComplete={() => setCanProceed(true)}
                onIncomplete={() => setCanProceed(false)}
              />
            )}
            {currentStep === 2 && (
              <PublishStep 
                ref={publishStepRef}
                setCurrentStep={setCurrentStep}
                onComplete={() => setCanProceed(true)}
                onIncomplete={() => setCanProceed(false)}
              />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Auto-save enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Smart assistance active</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Form Generator. Built with modern technology and intelligent assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
