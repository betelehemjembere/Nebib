"use client"

import { useParams } from "next/navigation"
import { useGetForm, type FormWithFields } from "./_hooks/formId-hooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, ExternalLink, Users, Calendar, Lock, ArrowLeft, FileText, BarChart3, TrendingUp, Eye, Edit, Trash2, Download, Share2, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { LinkIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FormActions from "@/components/form-management/form-actions"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

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

  const handleEdit = () => {
    toast.info("Edit form feature coming soon!");
  }

  const handleDelete = () => {
    toast.error("Delete form feature coming soon!");
  }

  const handlePreview = () => {
    openFormLink();
  }

  const handleViewStats = () => {
    toast.info("Detailed stats feature coming soon!");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2 h-8 w-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 truncate">{formData.topic}</h1>
                <p className="text-xs text-gray-600">Form Details</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={shareForm}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadSubmissions}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Form
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Desktop Back Button */}
        <div className="mb-6 hidden md:block">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
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
            <FormActions
              onShare={shareForm}
              onExport={downloadSubmissions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopyLink={copyLink}
              onOpenForm={openFormLink}
              onPreview={handlePreview}
              onViewStats={handleViewStats}
            />
          </div>
        </div>

        {/* Mobile Form Info */}
        <div className="md:hidden mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{formData.topic}</h2>
                  <p className="text-sm text-gray-600 mb-2">{formData.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {formData.status || "Active"}
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                      {formData.shareSetting || "Private"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Form Actions */}
        <div className="md:hidden mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <FormActions
                onShare={shareForm}
                onExport={downloadSubmissions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopyLink={copyLink}
                onOpenForm={openFormLink}
                onPreview={handlePreview}
                onViewStats={handleViewStats}
                isMobile={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formData.datas?.length || 0}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span className="text-xs sm:text-sm text-green-600">+12%</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Fields</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formData.fields?.length || 0}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span className="text-xs sm:text-sm text-blue-600">Structured</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Created</p>
                <p className="text-sm sm:text-lg font-semibold text-gray-900">{new Date(formData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">{new Date(formData.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Updated</p>
                <p className="text-sm sm:text-lg font-semibold text-gray-900">{new Date(formData.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">{new Date(formData.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Form Link Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/20 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">Form Link</h2>
              <p className="text-sm text-gray-600">Share this link to collect responses</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-200 text-green-700 text-xs sm:text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
                Live
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
              <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium break-all text-gray-700">
                {`${typeof window !== "undefined" ? window.location.origin : ""}/form/${formData.id}`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={copyLink}
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>

              <Button
                onClick={openFormLink}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm sm:text-base"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Form
              </Button>
            </div>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/20 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">Form Fields</h2>
              <p className="text-sm text-gray-600">
                {formData.fields?.length || 0} fields configured
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 text-sm sm:text-base">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </div>
          
          {formData.fields && formData.fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {formData.fields.map((field, index) => (
                <div key={field.id || index} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{field.label}</div>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2">
                        <span className="capitalize">{field.type}</span>
                        {field.required && <span className="text-red-500">• Required</span>}
                      </div>
                    </div>
                  </div>
                  {field.category && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                      {field.category}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm sm:text-base">No fields configured for this form.</p>
            </div>
          )}
        </div>

        {/* Submissions Section */}
        {formData.datas && formData.datas.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">Recent Submissions</h2>
                <p className="text-sm text-gray-600">
                  {formData.datas.length} total submissions
                </p>
              </div>
              <Button variant="outline" onClick={downloadSubmissions} className="flex items-center gap-2 text-sm sm:text-base">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {formData.datas.slice(0, 5).map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Submission #{index + 1}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {new Date(submission.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {Object.keys(submission.data || {}).length} fields
                  </div>
                </div>
              ))}
              
              {formData.datas.length > 5 && (
                <div className="text-center py-3 sm:py-4">
                  <Button variant="outline" onClick={() => toast.info("View all submissions feature coming soon!")} className="text-sm sm:text-base">
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
