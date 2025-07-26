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

    if (!form) return;

    // Validate required fields
    const missingRequiredFields = form.fields
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
      form.fields.forEach((field: any) => {
        if (formValues[field.id] !== undefined) {
          formattedData[field.label] = formValues[field.id];
        }
      });

      console.log("Submitting with labels:", formattedData);

      // Submit with hook or API
      await addData({
        datas: JSON.parse(JSON.stringify(formValues)),
        formId: form.id, // Use the extracted form's id
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
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="number"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );

      case "selection":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={formValues[id] || ""}
              onValueChange={(value) => handleInputChange(id, value)}
            >
              <SelectTrigger id={id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "array":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(
                  (e.target as HTMLInputElement).files || []
                );
                handleInputChange(id, files);
              }}
              required={required}
              className="w-full"
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <h1 className="text-xl text-red-500">Error</h1>
          <p>{error?.message || "Failed to load form data"}</p>
        </Card>
      </div>
    );
  }

  const form = Array.isArray(data) ? data[0] : data;

  // Group fields by category
  const groupedFields: Record<string, any[]> = {};
  const uncategorizedFields: any[] = [];

  form.fields.forEach((field: any) => {
    if (field.category) {
      if (!groupedFields[field.category]) {
        groupedFields[field.category] = [];
      }
      groupedFields[field.category].push(field);
    } else {
      uncategorizedFields.push(field);
    }
  });

  return (
    <div className="space-y-8 mt-4 px-4 text-[#4A90E2] font-extrabold">
      {/* <h1 className="text-3xl sm:text-4xl">Nebib Forms</h1> */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src="/images/logo.svg" className="h-10 w-10 text-blue-500" />
          <span className="ml-1  text-3xl sm:text-4xl text-blue-500">
            Nebib
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-white p-4">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <div className="mb-2">
            <h1 className="text-2xl font-extrabold sm:text-3xl text-[#4A90E2] mb-2">
              {form.topic}
            </h1>
            <p className="text-gray-600 text-base ml-1">{form.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="font-normal">
            <div className="space-y-8">
              {/* Render categorized fields */}
              {Object.entries(groupedFields).map(([category, fields]) => (
                <div key={category}>
                  <h2 className="text-lg font-medium mb-4">{category}</h2>
                  <div className="space-y-4">
                    {fields.map((field) => renderField(field))}
                  </div>
                </div>
              ))}

              {/* Render uncategorized fields */}
              {uncategorizedFields.length > 0 && (
                <div className="space-y-4">
                  {uncategorizedFields.map((field) => renderField(field))}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "SUBMIT"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <footer className="bg-gray-100 text-gray-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top section: Logo and description */}
          <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src="/images/logo.svg"
                alt="Nebib Logo"
                className="h-10 w-10"
              />
              <span className="ml-2 text-2xl font-bold text-blue-500">
                Nebib
              </span>
            </div>
            <p className="text-center md:text-left text-sm max-w-md">
              Your extensive form generator site. Build and manage forms
              effortlessly.
            </p>
          </div>

          {/* Middle section: Navigation and Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Navigation Links */}

            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Subscribe
              </h3>
              <p className="text-sm mb-4">Get the latest updates and offers.</p>
              <form className="flex flex-col sm:flex-row sm:items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 sm:mb-0 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Facebook Icon */}
                    <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Twitter Icon */}
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.12 1.03C7.69 5.4 4.07 3.6 1.64.9a4.52 4.52 0 00-.61 2.27c0 1.56.79 2.94 2 3.75a4.48 4.48 0 01-2.05-.57v.06c0 2.18 1.55 4 3.6 4.42a4.52 4.52 0 01-2.04.08 4.53 4.53 0 004.22 3.14A9.05 9.05 0 010 19.54a12.8 12.8 0 006.92 2.03c8.3 0 12.84-6.87 12.84-12.84 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* LinkedIn Icon */}
                    <path d="M20.45 20.45h-3.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5h-3.6V9h3.45v1.56h.05c.48-.9 1.65-1.8 3.4-1.8 3.63 0 4.3 2.4 4.3 5.5v6.2zM5.34 7.43a2.1 2.1 0 110-4.2 2.1 2.1 0 010 4.2zM6.9 20.45H3.8V9h3.1v11.45zM22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom section: Copyright */}
          <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Nebib. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
