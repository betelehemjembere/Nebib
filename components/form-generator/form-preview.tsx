"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { Sparkles, Send, CheckCircle, AlertCircle } from "lucide-react";

const fieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  type: z.enum(["text", "number", "email", "date", "checkbox", "textarea", "select"]),
  category: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  fields: z.array(fieldSchema),
});

type Field = z.infer<typeof fieldSchema>;
type FormData = z.infer<typeof formSchema>;

export default function FormPreview() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("form_data") || "null"
      );
      if (storedData) {
        setFormData(storedData);

        // Initialize form values
        const initialValues: Record<string, any> = {};
        storedData.fields?.forEach((field: Field) => {
          initialValues[field.id] = field.type === "checkbox" ? false : "";
        });
        setFormValues(initialValues);
      }
    }
  }, []);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      // Get response draft from publish data
      const publishData = JSON.parse(
        localStorage.getItem("publish_data") || "null"
      );
      if (publishData?.responseDraft) {
        console.log(`Response: ${publishData.responseDraft}`);
      }
    }, 1000);
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No form data available</p>
        </div>
      </div>
    );
  }

  const renderField = (field: Field) => {
    const fieldId = field.id;
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={fieldId}
            type="text"
            value={formValues[fieldId] || ""}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        );
      
      case 'email':
        return (
          <Input
            id={fieldId}
            type="email"
            value={formValues[fieldId] || ""}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
            placeholder="Enter your email address"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        );
      
      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            value={formValues[fieldId] || ""}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
            placeholder="Enter a number"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        );
      
      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            value={formValues[fieldId] || ""}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <Checkbox
              id={fieldId}
              checked={formValues[fieldId] || false}
              onCheckedChange={(checked) => handleInputChange(fieldId, checked)}
              required={field.required}
              className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label htmlFor={fieldId} className="text-sm font-medium leading-none cursor-pointer">
              {field.label}
            </Label>
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={formValues[fieldId] || ""}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
          />
        );
      
      case 'select':
        return (
          <Select value={formValues[fieldId] || ""} onValueChange={(value) => handleInputChange(fieldId, value)}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, idx) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return <Input placeholder="Field not supported" disabled />;
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Form Submitted Successfully!</h3>
        <p className="text-gray-600 mb-4">Thank you for your submission.</p>
        <Button 
          onClick={() => {
            setIsSubmitted(false);
            setFormValues({});
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Nebib Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Nebib Forms</h1>
              <p className="text-sm text-blue-100">Professional form builder</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Powered by Nebib
          </Badge>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{formData.topic}</h2>
          <p className="text-blue-100">{formData.description}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white p-6 rounded-b-xl border border-gray-200">
                 <form onSubmit={handleSubmit} className="space-y-8">
           {/* Group fields by category */}
           {(() => {
             // Group fields by category
             const groupedFields = formData.fields.reduce((acc, field) => {
               const category = field.category || 'General';
               if (!acc[category]) {
                 acc[category] = [];
               }
               acc[category].push(field);
               return acc;
             }, {} as Record<string, Field[]>);

             // Get unique categories in order
             const categories = Object.keys(groupedFields);
             
             return categories.map((category) => (
               <div key={category} className="space-y-4">
                 {/* Category Header */}
                 <div className="border-b border-gray-200 pb-2">
                   <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                     {category}
                   </h3>
                   <p className="text-sm text-gray-500 mt-1">
                     {groupedFields[category].length} field{groupedFields[category].length !== 1 ? 's' : ''}
                   </p>
                 </div>

                 {/* Fields in 2-column grid for this category */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {groupedFields[category].map((field) => (
                     <div key={field.id} className="space-y-3">
                       <div className="flex items-center justify-between">
                         <Label htmlFor={field.id} className="text-sm font-medium text-gray-700 flex items-center">
                           {field.label}
                           {field.required && <span className="text-red-500 ml-1">*</span>}
                         </Label>
                       </div>
                       
                       {renderField(field)}
                       
                       {field.required && (
                         <p className="text-xs text-gray-500 flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" />
                           This field is required
                         </p>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             ));
           })()}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Submit Form
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-500">
        <p>This form was created with Nebib Forms</p>
      </div>
    </div>
  );
}
