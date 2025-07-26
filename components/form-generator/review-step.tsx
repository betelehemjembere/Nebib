"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Mail,
  Calendar,
  Hash,
  CheckSquare,
  Type,
  Settings,
  Sparkles
} from "lucide-react";
import { z } from "zod";

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

interface ReviewStepProps {
  setCurrentStep: (arg0: number) => void;
  onComplete: () => void;
  onIncomplete: () => void;
}

export default function ReviewStep({ setCurrentStep, onComplete, onIncomplete }: ReviewStepProps) {
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("form_data") || "null"
      );
      return storedData
        ? {
            topic: storedData.topic || "",
            description: storedData.description || "",
            categories: Array.isArray(storedData.categories)
              ? storedData.categories
              : storedData.categories
              ? [storedData.categories]
              : [],
            fields: storedData.fields || [],
          }
        : {
            topic: "",
            description: "",
            categories: [],
            fields: [],
          };
    }
    return { topic: "", description: "", categories: [], fields: [] };
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("form_data", JSON.stringify(formData));
    }
  }, [formData, isHydrated]);

  // Check completion status
  useEffect(() => {
    const isComplete = formData.topic.trim() !== "" && 
                      formData.description.trim() !== "" && 
                      formData.categories.length > 0 &&
                      formData.fields.length > 0 &&
                      formData.fields.every(field => field.label.trim() !== "");
    
    if (isComplete) {
      onComplete();
    } else {
      onIncomplete();
    }
  }, [formData, onComplete, onIncomplete]);

  const deleteField = (fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    }));
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const getFieldIcon = (type: Field['type']) => {
    switch (type) {
      case 'text': return Type;
      case 'email': return Mail;
      case 'date': return Calendar;
      case 'number': return Hash;
      case 'checkbox': return CheckSquare;
      case 'textarea': return FileText;
      case 'select': return Settings;
      default: return Type;
    }
  };

  const renderFieldPreview = (field: Field) => {
    switch (field.type) {
      case 'text':
        return <Input placeholder={field.placeholder || `Enter ${field.label?.toLowerCase() || 'text'}`} disabled className="text-sm sm:text-base" />;
      case 'email':
        return <Input type="email" placeholder="Enter email address" disabled className="text-sm sm:text-base" />;
      case 'number':
        return <Input type="number" placeholder="Enter number" disabled className="text-sm sm:text-base" />;
      case 'date':
        return <Input type="date" disabled className="text-sm sm:text-base" />;
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" disabled />
            <Label className="text-sm sm:text-base">{field.label}</Label>
          </div>
        );
      case 'textarea':
        return <Textarea placeholder={field.placeholder || `Enter ${field.label?.toLowerCase() || 'text'}`} disabled className="text-sm sm:text-base" />;
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger className="text-sm sm:text-base">
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
        return <Input placeholder="Field preview" disabled className="text-sm sm:text-base" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Form Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            Form Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-600">Title</Label>
              <p className="text-base sm:text-lg font-semibold text-gray-900">{formData.topic || 'Untitled Form'}</p>
            </div>
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-600">Description</Label>
              <p className="text-sm sm:text-base text-gray-700">{formData.description || 'No description provided'}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-xs sm:text-sm font-medium text-gray-600">Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fields Review */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Form Fields ({formData.fields.length})
          </CardTitle>
          <div className="text-xs sm:text-sm text-gray-500">
            {formData.fields.filter(f => f.required).length} required
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {formData.fields.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm sm:text-base">No fields to review. Go back to add some fields.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {formData.fields.map((field, index) => {
              const Icon = getFieldIcon(field.type);
              const isEditing = editingField === field.id;
              
              return (
                <div key={field.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                          className="font-medium text-sm sm:text-base"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{field.label}</span>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingField(field.id)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 sm:h-9 sm:w-9 p-0"
                            >
                              <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteField(field.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9 p-0"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3">
                    <div className="text-xs sm:text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-1 font-medium capitalize">{field.type}</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-1 font-medium">{field.category || 'None'}</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      <span className="text-gray-500">Required:</span>
                      <span className={`ml-1 font-medium ${field.required ? 'text-red-500' : 'text-gray-500'}`}>
                        {field.required ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Field Preview */}
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                      Preview:
                    </Label>
                    {renderFieldPreview(field)}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex flex-col gap-3">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(0)}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generate
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">
              {formData.fields.length} fields • {formData.fields.filter(f => f.required).length} required
            </p>
            <p className="text-xs text-green-600">✓ Form is ready for publishing</p>
          </div>

          <Button 
            onClick={() => setCurrentStep(2)}
            disabled={formData.fields.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Continue to Publish
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(0)}
          className="px-6 py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Generate
        </Button>

        <div className="text-right">
          <p className="text-sm text-gray-600 mb-2">
            {formData.fields.length} fields • {formData.fields.filter(f => f.required).length} required
          </p>
          <p className="text-xs text-green-600">✓ Form is ready for publishing</p>
        </div>

        <Button 
          onClick={() => setCurrentStep(2)}
          disabled={formData.fields.length === 0}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Continue to Publish
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
