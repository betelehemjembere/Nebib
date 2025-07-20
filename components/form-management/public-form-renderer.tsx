"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "next/navigation"
import { useGetPublicForm } from "@/app/(admin)/form-management/[formId]/_hooks/formId-hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useAddData } from "@/app/(admin)/form-management/_hooks/form_hooks"
import { toast } from "sonner"
import QRGenerator from "@/components/qr-code/qr-generator"

export default function PublicFormRenderer() {
  const params = useParams()
  const formId = params?.formId as string
  const { data: form, isPending, error } = useGetPublicForm(formId)

  console.log("Public form data:", form)

  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const { mutate: addData, error: submissionError, isPending: isSubmitting } = useAddData()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form) return

    // Validate required fields
    const missingRequiredFields = form.fields
      .filter((field: any) => field.required)
      .filter((field: any) => !formValues[field.id] && formValues[field.id] !== false)

    if (missingRequiredFields.length > 0) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      console.log("Submitting with form values:", formValues)

      const result = await addData({
        datas: JSON.parse(JSON.stringify(formValues)),
        formId: form.id,
      })

      // Store submitted data for QR code generation
      setSubmittedData({
        formValues,
        formId: form.id,
        submissionId: (result as any)?.id || Date.now().toString()
      })
      
      setIsSubmitted(true)
      toast.success("Form submitted successfully! Your QR code is ready.")
    } catch (error) {
      console.error("Failed to submit form", error)
      toast.error("Failed to submit form")
    }
  }

  // Render different field types
  const renderField = (field: any) => {
    const { id, label, type, required } = field

    switch (type) {
      case "text":
        return (
          <Input
            id={id}
            type="text"
            value={formValues[id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
            required={required}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        )

      case "number":
        return (
          <Input
            id={id}
            type="number"
            value={formValues[id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
            required={required}
            placeholder="Enter a number"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        )

      case "email":
        return (
          <Input
            id={id}
            type="email"
            value={formValues[id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
            required={required}
            placeholder="Enter your email address"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        )

      case "date":
        return (
          <Input
            id={id}
            type="date"
            value={formValues[id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
            required={required}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-3">
            <Checkbox
              id={id}
              checked={formValues[id] || false}
              onCheckedChange={(checked) => handleInputChange(id, checked)}
              required={required}
              className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
              {label}
            </Label>
          </div>
        )

      case "textarea":
        return (
          <Textarea
            id={id}
            value={formValues[id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
            required={required}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
          />
        )

      case "select":
        return (
          <Select value={formValues[id] || ""} onValueChange={(value) => handleInputChange(id, value)}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, idx: number) => (
                <SelectItem key={idx} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return <Input placeholder="Field not supported" disabled />
    }
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading form...</span>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <h1 className="text-xl text-red-500">Form Not Found</h1>
          <p>The form you're looking for doesn't exist or has been removed.</p>
        </Card>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
            <h2 className="text-2xl font-bold mb-2">{form.topic}</h2>
            <p className="text-blue-100">{form.description}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-6 rounded-b-xl border border-gray-200">
          {isSubmitted && submittedData ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
                <p className="text-gray-600 mb-6">Your attendance QR code has been generated.</p>
              </div>
              
              <QRGenerator 
                userId={submittedData.submissionId}
                formId={submittedData.formId}
                formData={submittedData.formValues}
                className="max-w-md mx-auto"
              />
              
              <div className="text-center">
                <Button 
                  onClick={() => {
                    setIsSubmitted(false)
                    setSubmittedData(null)
                    setFormValues({})
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Submit Another Response
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Group fields by category */}
            {(() => {
              // Group fields by category
              const groupedFields = form.fields.reduce((acc: any, field: any) => {
                const category = field.category || 'General';
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(field);
                return acc;
              }, {} as Record<string, any[]>);

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
                    {groupedFields[category].map((field: any) => (
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-xs text-gray-500">
          <p>This form was created with Nebib Forms</p>
        </div>
      </div>
    </div>
  )
}
