"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  Hash, 
  Calendar, 
  CheckSquare, 
  ChevronDown,
  Save,
  Eye,
  ArrowLeft,
  Edit,
  X,
  Check,
  FileText,
  Sparkles,
  Send,
  AlertCircle,
  Globe,
  Lock,
  MessageSquare,
  Settings
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'date' | 'dropdown';
  required: boolean;
  options?: string[]; // For dropdown fields
  placeholder?: string;
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export default function FormGeneratorPage() {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: "section-1",
      title: "General Information",
      fields: []
    }
  ]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingFieldLabel, setEditingFieldLabel] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingSectionTitle, setEditingSectionTitle] = useState<string | null>(null);
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');
  const [showAddField, setShowAddField] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishSettings, setPublishSettings] = useState({
    shareSetting: 'private' as 'public' | 'private',
    accessCode: '',
    responseDraft: ''
  });

  const addSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      fields: []
    };
    setSections([...sections, newSection]);
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, title } : section
    ));
  };

  const addField = (sectionId: string, type: FormField['type'] = 'text') => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: `New ${type} field`,
      type,
      required: false,
      placeholder: `Enter ${type}...`
    };

    if (type === 'dropdown') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, fields: [...section.fields, newField] }
        : section
    ));

    // Auto-edit the newly added field label
    setEditingFieldLabel(newField.id);
    setShowAddField(null);
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            fields: section.fields.map(field => 
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : section
    ));
  };

  const removeField = (sectionId: string, fieldId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, fields: section.fields.filter(field => field.id !== fieldId) }
        : section
    ));
    setEditingField(null);
    setEditingFieldLabel(null);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== sectionId));
    }
  };

  const getFieldTypeIcon = (type: FormField['type']) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'checkbox': return <CheckSquare className="w-4 h-4" />;
      case 'dropdown': return <ChevronDown className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const getFieldTypeColor = (type: FormField['type']) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-600';
      case 'number': return 'bg-green-100 text-green-600';
      case 'date': return 'bg-purple-100 text-purple-600';
      case 'checkbox': return 'bg-orange-100 text-orange-600';
      case 'dropdown': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handlePublish = async () => {
    if (!formTitle.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    const totalFields = sections.reduce((sum, section) => sum + section.fields.length, 0);
    if (totalFields === 0) {
      toast.error("Please add at least one field to your form");
      return;
    }

    // Validate publish settings
    if (publishSettings.shareSetting === 'private' && !publishSettings.accessCode.trim()) {
      toast.error("Please enter an access code for private forms");
      return;
    }

    setIsPublishing(true);
    
    try {
      // Prepare the data in the format expected by the API
      const requestBody = {
        topic: formTitle,
        description: formDescription,
        categories: sections.map(section => section.title),
        fields: sections.flatMap(section => 
          section.fields.map(field => ({
            label: field.label,
            type: field.type,
            category: section.title,
            required: field.required,
            placeholder: field.placeholder,
            options: field.options
          }))
        )
      };
      
      console.log("Sending form data:", requestBody);
      
      const response = await fetch("/api/forms", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to publish form");
      }

      toast.success("Form published successfully!");
      setShowPublishDialog(false);
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish form. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsPublishing(true);
    
    try {
      // Save as draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const renderInlineTitle = () => {
    if (editingTitle) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-xl sm:text-2xl font-bold text-white bg-white/10 border-white/30 focus:border-white/50 placeholder-white/70"
            placeholder="Enter form title..."
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingTitle(false)}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {formTitle || "Untitled Form"}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingTitle(true)}
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderInlineDescription = () => {
    if (editingDescription) {
      return (
        <div className="flex items-start gap-2">
          <Textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="text-sm sm:text-base text-white bg-white/10 border-white/30 focus:border-white/50 placeholder-white/70 resize-none"
            placeholder="Enter form description..."
            rows={2}
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingDescription(false)}
            className="h-8 w-8 p-0 text-white hover:bg-white/20 mt-1"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-2">
        <p className="text-sm sm:text-base text-blue-100">
          {formDescription || "No description"}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingDescription(true)}
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderInlineSectionTitle = (section: FormSection) => {
    if (editingSectionTitle === section.id) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={section.title}
            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            className="font-medium border-blue-300 focus:border-blue-500"
            placeholder="Enter section title..."
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingSectionTitle(null)}
            className="h-8 w-8 p-0"
          >
            <Check className="w-4 h-4 text-green-600" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <h4 className="font-medium text-gray-900">
          {section.title}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingSectionTitle(section.id)}
          className="h-8 w-8 p-0"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderInlineFieldLabel = (field: FormField, sectionId: string) => {
    if (editingFieldLabel === field.id) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={field.label}
            onChange={(e) => updateField(sectionId, field.id, { label: e.target.value })}
            className="text-sm font-medium border-blue-300 focus:border-blue-500"
            placeholder="Enter field label..."
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingFieldLabel(null)}
            className="h-6 w-6 p-0"
          >
            <Check className="w-3 h-3 text-green-600" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded">
          {field.label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingFieldLabel(field.id)}
          className="h-6 w-6 p-0"
        >
          <Edit className="w-3 h-3" />
        </Button>
      </div>
    );
  };

  const renderFieldPreview = (field: FormField, sectionId: string) => {
    if (editingField === field.id) {
      return (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="space-y-3">
            <div>
              <Label>Field Label</Label>
              <Input
                value={field.label}
                onChange={(e) => updateField(sectionId, field.id, { label: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Placeholder</Label>
              <Input
                value={field.placeholder || ""}
                onChange={(e) => updateField(sectionId, field.id, { placeholder: e.target.value })}
                className="mt-1"
              />
            </div>

            {field.type === 'dropdown' && (
              <div>
                <Label>Options (one per line)</Label>
                <Textarea
                  value={field.options?.join('\n') || ""}
                  onChange={(e) => updateField(sectionId, field.id, { 
                    options: e.target.value.split('\n').filter(option => option.trim()) 
                  })}
                  className="mt-1"
                  rows={3}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`required-${field.id}`}
                    checked={field.required}
                    onChange={(e) => updateField(sectionId, field.id, { required: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor={`required-${field.id}`} className="text-sm">Required field</Label>
                </div>
                
                <Select
                  value={field.type}
                  onValueChange={(value: FormField['type']) => updateField(sectionId, field.id, { type: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingField(null)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Done
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeField(sectionId, field.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-3 bg-gray-50 rounded border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {renderInlineFieldLabel(field, sectionId)}
            {field.required && <span className="text-red-500">*</span>}
            <Badge className={getFieldTypeColor(field.type)}>
              {getFieldTypeIcon(field.type)}
              <span className="ml-1 capitalize">{field.type}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingField(field.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeField(sectionId, field.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {field.type === 'text' && <Input placeholder={field.placeholder} disabled />}
          {field.type === 'number' && <Input type="number" placeholder={field.placeholder} disabled />}
          {field.type === 'date' && <Input type="date" disabled />}
          {field.type === 'checkbox' && <input type="checkbox" disabled />}
          {field.type === 'dropdown' && (
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    );
  };

  const renderAddFieldButton = (sectionId: string) => {
    if (showAddField === sectionId) {
      return (
        <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Field Type</Label>
                <Select value={newFieldType} onValueChange={(value: FormField['type']) => setNewFieldType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="number">Number Input</SelectItem>
                    <SelectItem value="date">Date Picker</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => addField(sectionId, newFieldType)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add {newFieldType} field to this section</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button
                  variant="ghost"
                  onClick={() => setShowAddField(null)}
                  className="text-gray-500 hover:text-gray-700"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setShowAddField(sectionId)}
                className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 text-gray-600 hover:text-blue-600 transition-all duration-200 group-hover:border-blue-400 group-hover:bg-blue-50/30"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new field to this section</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Mobile Header */}
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
                <p className="text-xs text-gray-600">Build your form</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSaveDraft}
                      disabled={isPublishing}
                      className="h-8 w-8 p-0"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save as draft</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    disabled={isPublishing}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Publish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Publish Settings
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Share Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {publishSettings.shareSetting === "public" ? (
                          <Globe className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-orange-600" />
                        )}
                        <h3 className="font-semibold">Share Settings</h3>
                      </div>
                      
                      <RadioGroup
                        value={publishSettings.shareSetting}
                        onValueChange={(value: "public" | "private") =>
                          setPublishSettings(prev => ({ ...prev, shareSetting: value }))
                        }
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="public" id="public" />
                          <div className="flex-1 min-w-0">
                            <Label htmlFor="public" className="text-sm font-medium cursor-pointer">Public Access</Label>
                            <p className="text-xs text-gray-600">Anyone with the link can access and submit the form</p>
                          </div>
                          <Globe className="w-4 h-4 text-green-600 flex-shrink-0" />
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="private" id="private" />
                          <div className="flex-1 min-w-0">
                            <Label htmlFor="private" className="text-sm font-medium cursor-pointer">Private Access</Label>
                            <p className="text-xs text-gray-600">Requires an access code to view and submit the form</p>
                          </div>
                          <Lock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        </div>
                      </RadioGroup>

                      {publishSettings.shareSetting === "private" && (
                        <div className="space-y-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <Label htmlFor="accessCode" className="text-sm font-medium text-orange-800">Access Code *</Label>
                          <Input
                            id="accessCode"
                            placeholder="Enter form access code"
                            value={publishSettings.accessCode}
                            onChange={(e) => setPublishSettings(prev => ({ ...prev, accessCode: e.target.value }))}
                            className="border-orange-300 focus:border-orange-500"
                          />
                          <p className="text-xs text-orange-600">Share this code with users who should have access to your form</p>
                        </div>
                      )}
                    </div>

                    {/* Response Message */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <h3 className="font-semibold">Response Message</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Success Message (Optional)
                        </Label>
                        <Textarea
                          value={publishSettings.responseDraft}
                          onChange={(e) => setPublishSettings(prev => ({ ...prev, responseDraft: e.target.value }))}
                          placeholder="Thank you for your submission! We'll get back to you soon."
                          className="min-h-[80px] resize-none"
                        />
                        <p className="text-xs text-gray-500">This message will be shown to users after they successfully submit the form</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setShowPublishDialog(false)}
                        disabled={isPublishing}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {isPublishing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Publishing...
                          </div>
                        ) : (
                          "Publish Form"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Desktop Header */}
        <div className="mb-6 sm:mb-8 hidden md:block">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Form</h1>
                <p className="text-gray-600 mt-1">Build your form with our intuitive builder</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                disabled={isPublishing}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogTrigger asChild>
                  <Button 
                    disabled={isPublishing}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Publish Form
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Inline Form Builder */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Form Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full max-w-4xl mx-auto">
                {/* Nebib Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6 rounded-t-xl">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h1 className="text-base sm:text-lg font-bold">Nebib Forms</h1>
                        <p className="text-xs sm:text-sm text-blue-100">Professional form builder</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                      Powered by Nebib
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-1 sm:mb-2">
                      {renderInlineTitle()}
                    </div>
                    <div>
                      {renderInlineDescription()}
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="bg-white p-4 sm:p-6 rounded-b-xl border border-gray-200">
                  <div className="space-y-6 sm:space-y-8">
                    {sections.map(section => (
                      <div key={section.id} className="space-y-3 sm:space-y-4">
                        {/* Section Header */}
                        <div className="border-b border-gray-200 pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {renderInlineSectionTitle(section)}
                            </div>
                            <div className="flex items-center gap-2">
                              {sections.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSection(section.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {section.fields.length} field{section.fields.length !== 1 ? 's' : ''}
                          </p>
                        </div>

                        {/* Fields in 1-column grid for mobile, 2-column for desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {section.fields.map(field => (
                            <div key={field.id} className="space-y-2 sm:space-y-3 group/field">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {renderInlineFieldLabel(field, section.id)}
                                  {field.required && <span className="text-red-500">*</span>}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingField(field.id)}
                                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeField(section.id, field.id)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                {field.type === 'text' && (
                                  <Input placeholder={field.placeholder} disabled />
                                )}
                                {field.type === 'number' && (
                                  <Input type="number" placeholder={field.placeholder} disabled />
                                )}
                                {field.type === 'date' && (
                                  <Input type="date" disabled />
                                )}
                                {field.type === 'checkbox' && (
                                  <div className="flex items-center space-x-3">
                                    <input type="checkbox" disabled />
                                    <span className="text-sm">{field.label}</span>
                                  </div>
                                )}
                                {field.type === 'dropdown' && (
                                  <Select disabled>
                                    <SelectTrigger>
                                      <SelectValue placeholder={field.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options?.map((option, index) => (
                                        <SelectItem key={index} value={option}>{option}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                              
                              {field.required && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  This field is required
                                </p>
                              )}

                              {/* Field Editor Overlay */}
                              {editingField === field.id && (
                                <div className="mt-3 p-3 border border-blue-200 rounded-lg bg-blue-50/50">
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-xs font-medium text-gray-700">Field Label</Label>
                                      <Input
                                        value={field.label}
                                        onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                                        className="mt-1 text-sm"
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label className="text-xs font-medium text-gray-700">Placeholder</Label>
                                      <Input
                                        value={field.placeholder || ""}
                                        onChange={(e) => updateField(section.id, field.id, { placeholder: e.target.value })}
                                        className="mt-1 text-sm"
                                      />
                                    </div>

                                    {field.type === 'dropdown' && (
                                      <div>
                                        <Label className="text-xs font-medium text-gray-700">Options (one per line)</Label>
                                        <Textarea
                                          value={field.options?.join('\n') || ""}
                                          onChange={(e) => updateField(section.id, field.id, { 
                                            options: e.target.value.split('\n').filter(option => option.trim()) 
                                          })}
                                          className="mt-1 text-sm"
                                          rows={3}
                                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                                        />
                                      </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            id={`required-${field.id}`}
                                            checked={field.required}
                                            onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                                            className="rounded"
                                          />
                                          <Label htmlFor={`required-${field.id}`} className="text-xs">Required field</Label>
                                        </div>
                                        
                                        <Select
                                          value={field.type}
                                          onValueChange={(value: FormField['type']) => updateField(section.id, field.id, { type: value })}
                                        >
                                          <SelectTrigger className="w-32 text-xs">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                            <SelectItem value="dropdown">Dropdown</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setEditingField(null)}
                                          className="text-xs"
                                        >
                                          <X className="w-3 h-3 mr-1" />
                                          Done
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Field Button */}
                        <div className="mt-4">
                          {renderAddFieldButton(section.id)}
                        </div>
                      </div>
                    ))}

                    {/* Add Section Button */}
                    <div className="pt-4 sm:pt-6 border-t border-gray-200">
                      <div className="group">
                        <Button
                          variant="outline"
                          onClick={addSection}
                          className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50/30 text-gray-600 hover:text-green-600 transition-all duration-200 group-hover:border-green-400 group-hover:bg-green-50/30"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Section
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 sm:pt-6 border-t border-gray-200">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 sm:py-3 text-base sm:text-lg font-medium shadow-lg"
                        disabled
                      >
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">Submit Form</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center py-3 sm:py-4 text-xs text-gray-500">
                  <p>This form was created with Nebib Forms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
