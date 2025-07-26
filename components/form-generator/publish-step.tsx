"use client"

import type React from "react"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"
import { toast } from "sonner"
import FormPreview from "./form-preview"
import { ArrowLeft, Copy, ExternalLink, Upload, Settings, Eye, Globe, Lock, MessageSquare, CheckCircle } from "lucide-react"

const publishSchema = z.object({
  accessCode: z.string().optional(),
  shareSetting: z.enum(["public", "private"]),
  responseDraft: z.string().optional(),
})

type PublishData = z.infer<typeof publishSchema>

interface PublishStepProps {
  setCurrentStep: (arg0: number) => void;
  onComplete: () => void;
  onIncomplete: () => void;
}

const PublishStep = forwardRef<{ saveToDatabase: () => Promise<void> }, PublishStepProps>(
  ({ setCurrentStep, onComplete, onIncomplete }, ref) => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("setting")
  const [publishedFormId, setPublishedFormId] = useState<string | null>(null)
  const [publishData, setPublishData] = useState<PublishData>(() => {
    if (typeof window !== "undefined") {
      return (
        JSON.parse(localStorage.getItem("publish_data") || "null") || {
          shareSetting: "private",
          responseDraft: "",
          accessCode: "",
        }
      )
    }
    return { shareSetting: "private", responseDraft: "", accessCode: "" }
  })

  const handlePublishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPublishData((prev) => ({ ...prev, [name]: value }))
  }

  // Check completion status
  useEffect(() => {
    const isComplete = publishData.shareSetting === "public" || 
                      (publishData.shareSetting === "private" && (publishData.accessCode || "").trim() !== "");
    
    if (isComplete) {
      onComplete();
    } else {
      onIncomplete();
    }
  }, [publishData, onComplete, onIncomplete]);

  const saveToDatabase = async () => {
    const formData = JSON.parse(localStorage.getItem("form_data") || "null")
    try {
      setIsLoading(true)
      
      // Prepare the data in the format expected by the API
      const requestBody = {
        topic: formData.topic,
        description: formData.description,
        categories: formData.categories,
        fields: formData.fields,
      }
      
      console.log("Sending form data:", requestBody)
      
      const response = await fetch("/api/forms", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error)
      }

      setPublishedFormId(data.id)
      toast.success("Form published successfully!")

      // Store the published form ID
      localStorage.setItem("published_form_id", data.id)
    } catch (error: any) {
      console.error("Publish error:", error)
      toast.error("Error publishing form")
    } finally {
      setIsLoading(false)
    }
  }

  // Expose saveToDatabase function to parent component
  useImperativeHandle(ref, () => ({
    saveToDatabase
  }), [])

  const copyPublicLink = () => {
    if (publishedFormId) {
      const publicLink = `${window.location.origin}/form/${publishedFormId}`
      navigator.clipboard.writeText(publicLink)
      toast.success("Public link copied to clipboard!")
    }
  }

  const openPublicLink = () => {
    if (publishedFormId) {
      const publicLink = `${window.location.origin}/form/${publishedFormId}`
      window.open(publicLink, "_blank")
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Tab Navigation */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            Publish Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg mb-4 sm:mb-6">
            <Button
              variant={activeTab === "setting" ? "default" : "ghost"}
              className={`flex-1 flex items-center gap-2 text-xs sm:text-sm h-9 sm:h-10 ${
                activeTab === "setting" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("setting")}
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              Settings
            </Button>
            <Button
              variant={activeTab === "preview" ? "default" : "ghost"}
              className={`flex-1 flex items-center gap-2 text-xs sm:text-sm h-9 sm:h-10 ${
                activeTab === "preview" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              Preview
            </Button>
          </div>

          {activeTab === "setting" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Share Settings */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    {publishData.shareSetting === "public" ? (
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    )}
                    Share Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <RadioGroup
                    value={publishData.shareSetting}
                    onValueChange={(value: "public" | "private") =>
                      setPublishData((prev) => ({ ...prev, shareSetting: value }))
                    }
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="public" id="public" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="public" className="text-sm sm:text-base font-medium cursor-pointer">Public Access</Label>
                        <p className="text-xs sm:text-sm text-gray-600">Anyone with the link can access and submit the form</p>
                      </div>
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="private" id="private" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="private" className="text-sm sm:text-base font-medium cursor-pointer">Private Access</Label>
                        <p className="text-xs sm:text-sm text-gray-600">Requires an access code to view and submit the form</p>
                      </div>
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                    </div>
                  </RadioGroup>

                  {publishData.shareSetting === "private" && (
                    <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <Label htmlFor="accessCode" className="text-xs sm:text-sm font-medium text-orange-800">Access Code *</Label>
                      <Input
                        id="accessCode"
                        name="accessCode"
                        placeholder="Enter form access code"
                        value={publishData.accessCode}
                        onChange={handlePublishChange}
                        className="border-orange-300 focus:border-orange-500 text-sm sm:text-base"
                      />
                      <p className="text-xs text-orange-600">Share this code with users who should have access to your form</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Response Message */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    Response Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-medium text-gray-700">
                    Success Message (Optional)
                  </Label>
                  <Textarea
                    name="responseDraft"
                    value={publishData.responseDraft}
                    onChange={handlePublishChange}
                    placeholder="Thank you for your submission! We'll get back to you soon."
                    className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500">This message will be shown to users after they successfully submit the form</p>
                </CardContent>
              </Card>

              {/* Published Form Info */}
              {publishedFormId && (
                <Card className="border border-green-200 bg-green-50">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-green-800">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Form Published Successfully!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-green-700">Public Link:</Label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Input 
                          value={`${window.location.origin}/form/${publishedFormId}`} 
                          readOnly 
                          className="bg-white border-green-300 text-green-800 font-mono text-xs sm:text-sm" 
                        />
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={copyPublicLink} 
                            className="bg-green-600 hover:bg-green-700 text-white h-8 sm:h-9"
                          >
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={openPublicLink} 
                            className="bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9"
                          >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <Globe className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                      <span className="text-xs sm:text-sm text-green-700">Your form is now accessible to users</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "preview" && (
            <Card className="border border-gray-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  Form Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="bg-gray-50 rounded-lg min-h-[300px] sm:min-h-[400px] sm:p-6">
                  <FormPreview />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex flex-col gap-3">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">
              {publishData.shareSetting === "public" ? "Public form" : "Private form"}
            </p>
            <p className="text-xs text-green-600">✓ Ready to publish</p>
          </div>

          <Button 
            onClick={saveToDatabase} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? "Publishing..." : publishedFormId ? "Update Form" : "Publish Form"}
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="px-6 py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Review
        </Button>

        <div className="text-right">
          <p className="text-sm text-gray-600 mb-2">
            {publishData.shareSetting === "public" ? "Public form" : "Private form"}
          </p>
          <p className="text-xs text-green-600">✓ Ready to publish</p>
        </div>

        <Button 
          onClick={saveToDatabase} 
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? "Publishing..." : publishedFormId ? "Update Form" : "Publish Form"}
        </Button>
      </div>
    </div>
  )
})

PublishStep.displayName = 'PublishStep'

export default PublishStep
