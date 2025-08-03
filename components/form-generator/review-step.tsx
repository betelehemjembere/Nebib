"use client";

import React, { useEffect, useState } from "react";
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
    <div className="space-y-6">
      {/* Form Overview */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Form Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Title</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white font-medium">{formData.topic || "Untitled Form"}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</Label>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-white">{formData.description || "No description provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Preview */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            Form Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-2xl mx-auto">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Nebib Forms</h1>
                    <p className="text-sm text-blue-100">Professional form builder</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Preview
                </Badge>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">{formData.topic || "Untitled Form"}</h2>
                <p className="text-blue-100">{formData.description || "No description provided"}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-b-xl border border-gray-200 dark:border-gray-600">
              <div className="space-y-6">
                {formData.fields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p>No fields added yet</p>
                  </div>
                ) : (
                  formData.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500">
                          {field.type}
                        </Badge>
                      </div>
                      {renderFieldPreview(field)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Management */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Field Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>No fields to manage</p>
              </div>
            ) : (
              formData.fields.map((field) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        {React.createElement(getFieldIcon(field.type), { className: "w-4 h-4 text-blue-600 dark:text-blue-400" })}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{field.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {field.type} • {field.category} • {field.required ? "Required" : "Optional"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteField(field.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {editingField === field.id && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value: Field['type']) => updateField(field.id, { type: value })}
                        >
                          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectItem value="text" className="text-gray-900 dark:text-white">Text</SelectItem>
                            <SelectItem value="number" className="text-gray-900 dark:text-white">Number</SelectItem>
                            <SelectItem value="email" className="text-gray-900 dark:text-white">Email</SelectItem>
                            <SelectItem value="date" className="text-gray-900 dark:text-white">Date</SelectItem>
                            <SelectItem value="checkbox" className="text-gray-900 dark:text-white">Checkbox</SelectItem>
                            <SelectItem value="textarea" className="text-gray-900 dark:text-white">Textarea</SelectItem>
                            <SelectItem value="select" className="text-gray-900 dark:text-white">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                        <Select
                          value={field.category}
                          onValueChange={(value) => updateField(field.id, { category: value })}
                        >
                          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            {formData.categories.map((category) => (
                              <SelectItem key={category} value={category} className="text-gray-900 dark:text-white">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Placeholder</Label>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="Optional placeholder..."
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Builder
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formData.fields.length} fields • {formData.fields.filter(f => f.required).length} required
          </div>
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Continue to Publish
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
