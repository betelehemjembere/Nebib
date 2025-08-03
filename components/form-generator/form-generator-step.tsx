"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  Sparkles,
  FileText,
  Mail,
  Calendar,
  Hash,
  CheckSquare,
  Type,
  Settings,
  Copy
} from "lucide-react";

// Zod Schema for Form Fields
const fieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  type: z.enum(["text", "number", "email", "date", "checkbox", "textarea", "select"]),
  category: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(), // For select fields
});

export const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  fields: z.array(fieldSchema),
});

type Field = z.infer<typeof fieldSchema>;
type FormData = z.infer<typeof formSchema>;

interface FormGeneratorStepProps {
  onComplete: () => void;
  onIncomplete: () => void;
}

// Field templates for quick addition
const fieldTemplates = [
  { label: "Full Name", type: "text", icon: Type, category: "Personal" },
  { label: "Email Address", type: "email", icon: Mail, category: "Contact" },
  { label: "Phone Number", type: "text", icon: Hash, category: "Contact" },
  { label: "Date of Birth", type: "date", icon: Calendar, category: "Personal" },
  { label: "Terms & Conditions", type: "checkbox", icon: CheckSquare, category: "Legal" },
  { label: "Additional Comments", type: "textarea", icon: FileText, category: "General" },
];

export default function FormGeneratorStep({ onComplete, onIncomplete }: FormGeneratorStepProps) {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    description: "",
    categories: ["Personal", "Contact", "General", "Legal"],
    fields: [],
  });

  const [newCategory, setNewCategory] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data from localStorage after hydration
  useEffect(() => {
    const storedData = localStorage.getItem("form_data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Ensure all fields have unique IDs
        const fieldsWithIds = (parsedData.fields || []).map((field: any, index: number) => {
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substr(2, 9);
          return {
            ...field,
            id: field.id || `field_${timestamp}_${randomId}_${index}`,
          };
        });
        
        setFormData({
          topic: parsedData.topic || "",
          description: parsedData.description || "",
          categories: Array.isArray(parsedData.categories) ? parsedData.categories : ["Personal", "Contact", "General", "Legal"],
          fields: fieldsWithIds,
        });
      } catch (error) {
        console.error("Error parsing stored form data:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage after hydration
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

  const addField = (template?: typeof fieldTemplates[0]) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const uniqueId = `field_${timestamp}_${randomId}`;
    
    const newField: Field = template ? {
      id: uniqueId,
      label: template.label,
      type: template.type as Field['type'],
      category: template.category,
      required: false,
      placeholder: `Enter ${template.label.toLowerCase()}`,
      options: template.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    } : {
      id: uniqueId,
      label: "",
      type: "text",
      category: "",
      required: false,
      placeholder: "Enter field label",
    };

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const removeField = (fieldId: string) => {
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

  const addCategory = () => {
    if (!newCategory.trim() || formData.categories.includes(newCategory.trim()))
      return;
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory.trim()],
    }));
    setNewCategory("");
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
      fields: prev.fields.map((field) =>
        field.category === categoryToRemove ? { ...field, category: "" } : field
      ),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Form Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Form Title *
            </Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Enter your form title..."
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this form is for..."
              rows={3}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Form Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(category)}
                  className="h-4 w-4 p-0 ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/30"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category..."
              className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Button
              onClick={addCategory}
              disabled={!newCategory.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fields */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            Form Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Field Templates */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fieldTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => addField(template)}
                className="h-auto p-3 flex flex-col items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
              >
                <template.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{template.label}</span>
              </Button>
            ))}
          </div>

          {/* Custom Fields */}
          <div className="space-y-4">
            {formData.fields.map((field) => (
              <div
                key={field.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      {React.createElement(getFieldIcon(field.type), { className: "w-4 h-4 text-blue-600 dark:text-blue-400" })}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{field.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{field.type} • {field.category}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(field.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      placeholder="Optional placeholder text..."
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  
                  {field.type === "select" && (
                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</Label>
                      <div className="space-y-2">
                        {(field.options || []).map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(field.options || [])];
                                newOptions[index] = e.target.value;
                                updateField(field.id, { options: newOptions });
                              }}
                              placeholder={`Option ${index + 1}`}
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newOptions = (field.options || []).filter((_, i) => i !== index);
                                updateField(field.id, { options: newOptions });
                              }}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = [...(field.options || []), ""];
                            updateField(field.id, { options: newOptions });
                          }}
                          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="sm:col-span-2 flex items-center space-x-2">
                    <Switch
                      id={`required-${field.id}`}
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                    />
                    <Label htmlFor={`required-${field.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Required field
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Field */}
          <Button
            variant="outline"
            onClick={() => addField()}
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Field
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
