"use client";

import FormGeneratorStep from "@/components/form-generator/form-generator-step";
import PublishStep from "@/components/form-generator/publish-step";
import ReviewStep from "@/components/form-generator/review-step";
import StepNavigation from "@/components/form-generator/step-navigation";
import { useState, useRef } from "react";
import { 
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Eye,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20 md:pb-8">
      {/* Mobile App Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Create Form</h1>
                <p className="text-xs text-gray-600">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-green-100 rounded-full">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Smart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Desktop Header Section */}
        <div className="mb-6 sm:mb-8 hidden md:block">
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
        <div className="mb-6 sm:mb-8">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-4 sm:p-8">
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

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden mt-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Auto-save</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span>Smart AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden md:block mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Auto-save enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Smart AI assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Real-time validation</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
