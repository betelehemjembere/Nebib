"use client"

import { useParams } from "next/navigation"
import { useGetForm, type FormWithFields } from "./_hooks/formId-hooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, ExternalLink, Users, Calendar, Lock, ArrowLeft, FileText, BarChart3, TrendingUp, Eye, Edit, Trash2, Download, Share2 } from "lucide-react"
import { toast } from "sonner"
import { LinkIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FormDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [formId, setFormId] = useState<string>("")

  // Handle params properly to avoid hydration issues
  useEffect(() => {
    if (params?.formId) {
      setFormId(params.formId as string)
    }
  }, [params])

  const { data: form, isPending, error } = useGetForm(formId)

  const copyLink = () => {
    if (form && form[0]) {
      const publicLink = `${window.location.origin}/form/${form[0].id}`
      navigator.clipboard
        .writeText(publicLink)
        .then(() => {
          toast.success("Form link copied to clipboard!")
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          toast.error("Failed to copy link")
        })
    }
  }

  const openFormLink = () => {
    if (form && form[0]) {
      const publicLink = `${window.location.origin}/form/${form[0].id}`
      window.open(publicLink, "_blank")
    }
  }


  const downloadSubmissions = () => {
    if (formData.datas && formData.datas.length > 0) {
      // Create CSV content
      const headers = formData.fields?.map(field => field.label).join(',') || '';
      const csvContent = `data:text/csv;charset=utf-8,${headers}\n`;
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${formData.topic}_submissions.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Submissions downloaded successfully!");
    } else {
      toast.error("No submissions to download");
    }
  }

  const shareForm = () => {
    if (form && form[0]) {
      const publicLink = `${window.location.origin}/form/${form[0].id}`
      if (navigator.share) {
        navigator.share({
          title: form[0].topic,
          text: form[0].description,
          url: publicLink,
        })
      } else {
        copyLink()
      }
    }
  }

  

  if (!formId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading form details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <h1 className="text-xl text-red-500">Error Loading Form</h1>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : "Failed to load form details"}</p>
          <div className="bg-gray-100 p-3 rounded text-sm space-y-2">
            <div>
              <strong>Form ID:</strong> {formId}
            </div>
            <div>
              <strong>Error Details:</strong> {JSON.stringify(error)}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
              <button
                onClick={() => window.open(`/api/test-simple/${formId}`, "_blank")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Test Route
              </button>
              <button
                onClick={() => window.open(`/api/forms/${formId}`, "_blank")}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Test API Direct
              </button>
              <button
                onClick={() => window.open(`/api/debug-forms`, "_blank")}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Debug Database
              </button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!form || !form[0]) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <h1 className="text-xl text-red-500">Form Not Found</h1>
          <p className="text-gray-600 mb-4">The form you're looking for doesn't exist in the database.</p>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <strong>Form ID:</strong> {formId}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">Possible reasons:</p>
            <ul className="text-sm text-gray-500 list-disc list-inside">
              <li>The form ID is incorrect</li>
              <li>The form was deleted</li>
              <li>Database connection issue</li>
            </ul>
            <button
              onClick={() => window.open(`/api/debug-forms`, "_blank")}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Debug Database
            </button>
          </div>
        </Card>
      </div>
    )
  }

  const formData: FormWithFields = form[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </Button>
        </div>

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.topic}</h1>
                <p className="text-gray-600 text-lg mb-4">{formData.description}</p>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">
                    {formData.status || "Active"}
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {formData.shareSetting || "Private"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={shareForm} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" onClick={downloadSubmissions} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Form
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{formData.datas?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+12% from last week</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Form Fields</p>
                <p className="text-2xl font-bold text-gray-900">{formData.fields?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600">Well structured</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-lg font-semibold text-gray-900">{new Date(formData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{new Date(formData.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">{new Date(formData.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{new Date(formData.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Form Link Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Form Link</h2>
              <p className="text-gray-600">Share this link to collect responses from users</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-200 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <LinkIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span className="text-sm font-medium flex-1 break-all text-gray-700">
                {`${typeof window !== "undefined" ? window.location.origin : ""}/form/${formData.id}`}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={copyLink}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>

              <Button
                onClick={openFormLink}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Form
              </Button>
            </div>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Form Fields</h2>
              <p className="text-gray-600">
                Fields configured for this form ({formData.fields?.length || 0} fields)
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview Form
            </Button>
          </div>
          
          {formData.fields && formData.fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.fields.map((field, index) => (
                <div key={field.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{field.label}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="capitalize">{field.type}</span>
                        {field.required && <span className="text-red-500">• Required</span>}
                      </div>
                    </div>
                  </div>
                  {field.category && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {field.category}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No fields configured for this form.</p>
            </div>
          )}
        </div>

        {/* Submissions Section */}
        {formData.datas && formData.datas.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Recent Submissions</h2>
                <p className="text-gray-600">
                  Latest responses from your form ({formData.datas.length} total submissions)
                </p>
              </div>
              <Button variant="outline" onClick={downloadSubmissions} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.datas.slice(0, 5).map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Submission #{index + 1}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(submission.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Object.keys(submission.data || {}).length} fields filled
                  </div>
                </div>
              ))}
              
              {formData.datas.length > 5 && (
                <div className="text-center py-4">
                  <Button variant="outline" onClick={() => toast.info("View all submissions feature coming soon!")}>
                    View All {formData.datas.length} Submissions
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
