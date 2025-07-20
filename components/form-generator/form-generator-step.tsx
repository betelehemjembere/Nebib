"use client";

import { useEffect, useState } from "react";
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
    <div className="space-y-6 sm:space-y-8">
      {/* Basic Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            Form Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">Form Title *</Label>
            <Textarea
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Enter a descriptive title for your form..."
              className="min-h-[60px] sm:min-h-[80px] resize-none text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe what this form is for..."
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                  onClick={() => removeCategory(category)}
                >
                  {category}
                  <span className="ml-1 text-red-500">×</span>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add new category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                className="flex-1 text-sm sm:text-base"
              />
              <Button
                type="button"
                size="sm"
                onClick={addCategory}
                disabled={!newCategory.trim()}
                className="px-3 sm:px-4 h-9 sm:h-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Templates */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            Quick Add Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {fieldTemplates.map((template, index) => {
              const Icon = template.icon;
              return (
                <Button
                  key={`template_${template.label}_${index}`}
                  variant="outline"
                  onClick={() => addField(template)}
                  className="h-auto p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all text-xs sm:text-sm"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-medium">{template.label}</span>
                  <span className="text-gray-500">{template.type}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Fields */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            Form Fields ({formData.fields.length})
          </CardTitle>
          <Button
            onClick={() => addField()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base h-9 sm:h-10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {formData.fields.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm sm:text-base">No fields added yet. Start by adding some fields above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {formData.fields.map((field, index) => {
                const Icon = getFieldIcon(field.type);
                return (
                  <div key={field.id || `field_${index}`} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        placeholder="Field label..."
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="font-medium text-sm sm:text-base"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(field.id, { type: value as Field['type'] })}
                    >
                      <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                        <SelectValue placeholder="Field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={field.category}
                      onValueChange={(value) => updateField(field.id, { category: value })}
                    >
                      <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        className="data-[state=checked]:bg-blue-500"
                      />
                      <Label className="text-xs sm:text-sm">Required</Label>
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div className="mt-3">
                      <Label className="text-xs sm:text-sm text-gray-600">Options (one per line)</Label>
                      <Textarea
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        value={field.options?.join('\n') || ''}
                        onChange={(e) => updateField(field.id, { 
                          options: e.target.value.split('\n').filter(opt => opt.trim()) 
                        })}
                        className="mt-1 min-h-[50px] sm:min-h-[60px] text-xs sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Status */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gray-100">
          <div className={`w-2 h-2 rounded-full ${formData.fields.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-xs sm:text-sm text-gray-600">
            {formData.fields.length} fields added • {formData.fields.filter(f => f.required).length} required
          </span>
        </div>
      </div>
    </div>
  );
}
