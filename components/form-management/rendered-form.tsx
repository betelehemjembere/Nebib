"use client";

import type React from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetRenderedForm } from "@/app/(admin)/form-management/[formId]/_hooks/formId-hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAddData } from "@/app/(admin)/form-management/_hooks/form_hooks";
import { toast } from "sonner";

export default function FormPage() {
  const params = useParams();
  const link = params?.link as string;
  const { data, isPending, error } = useGetRenderedForm(link);

  console.log(data);

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // Extract the first form from the array
  const formData = data && data.length > 0 ? data[0] : null;

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const {
    mutate: addData,
    error: submissionError,
    isPending: isSubmitting,
  } = useAddData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    // Validate required fields
    const missingRequiredFields = formData.fields
      .filter((field: any) => field.required)
      .filter(
        (field: any) => !formValues[field.id] && formValues[field.id] !== false
      );

    if (missingRequiredFields.length > 0) {
      console.log("Please fill in all required fields");
      return;
    }

    try {
      // Map field IDs to labels with values
      const formattedData: Record<string, any> = {};
      formData.fields.forEach((field: any) => {
        if (formValues[field.id] !== undefined) {
          formattedData[field.label] = formValues[field.id];
        }
      });

      console.log("Submitting with labels:", formattedData);

      // Submit with hook or API
      await addData({
        datas: JSON.parse(JSON.stringify(formValues)),
        formId: formData.id, // Use the extracted form's id
      });

      // Optionally reset form values
      setFormValues({});
    } catch (error) {
      console.error("Failed to submit form", error);
    } 
  };

  if (submissionError) {
    toast.error("unable to submit form");
  }

  // Render different field types
  const renderField = (field: any) => {
    const { id, label, type, required } = field;

    switch (type) {
      case "text":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="text"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        );

      case "email":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="email"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="number"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        );

      case "date":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="date"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        );

      case "select":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={formValues[id] || ""} onValueChange={(value) => handleInputChange(id, value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={id}>
            <input
              type="checkbox"
              id={id}
              checked={formValues[id] || false}
              onChange={(e) => handleInputChange(id, e.target.checked)}
              required={required}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      default:
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="text"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        );
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading form</p>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Form not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="p-6 sm:p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formData?.topic}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                {formData?.description}
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {formData?.fields?.map((field: any) => renderField(field))}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Form"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
