"use client"

import { useParams } from "next/navigation"
import { useGetForm, type FormWithFields } from "./_hooks/formId-hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Loader2, 
  Copy, 
  ExternalLink, 
  Users, 
  Calendar, 
  ArrowLeft, 
  FileText, 
  BarChart3, 
  Download,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Clock,
  Filter,
  Plus,
  QrCode,
  Smartphone,
  Camera,
  Scan,
  Download as DownloadIcon
} from "lucide-react"
import { toast } from "sonner"
import QRScanner from "@/components/qr-code/qr-scanner"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface FormSubmission {
  id: string;
  data: any;
  createdAt: string;
  formId: string;
}

interface ProcessedSubmission {
  id: string;
  fields: Array<{
    label: string;
    value: any;
    type: string;
  }>;
  submittedAt: string;
  email?: string;
  name?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  session: string;
  formId: string;
}

export default function FormDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [formId, setFormId] = useState<string>("")
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all')
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannedData, setScannedData] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)

  // Handle params properly to avoid hydration issues
  useEffect(() => {
    if (params?.formId) {
      setFormId(params.formId as string)
    }
  }, [params])

  const { data: form, isPending, error } = useGetForm(formId)

  // Process form submissions data
  const processSubmissions = (): ProcessedSubmission[] => {
    if (!form || !form[0] || !form[0].datas) return []
    
    return form[0].datas.map((submission: FormSubmission) => {
      const fields = form[0].fields.map(field => {
        const value = submission.data[field.label] || submission.data[field.id] || ''
        return {
          label: field.label,
          value: value,
          type: field.type
        }
      })
      
      // Try to extract email and name from common field names
      const email = fields.find(f => 
        f.label.toLowerCase().includes('email') || 
        f.label.toLowerCase().includes('e-mail')
      )?.value
      
      const name = fields.find(f => 
        f.label.toLowerCase().includes('name') || 
        f.label.toLowerCase().includes('full name')
      )?.value
      
      return {
        id: submission.id,
        fields,
        submittedAt: submission.createdAt,
        email,
        name
      }
    })
  }

  const submissions = processSubmissions()

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    if (!formId) return
    setAttendanceLoading(true)
    try {
      const response = await fetch(`/api/attendance?formId=${formId}`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch attendance data')
      const data = await response.json()
      // Filter records for this specific form
      const formRecords = (data.attendanceRecords || []).filter((record: any) => record.formId === formId)
      setAttendanceData(formRecords)
    } catch (error) {
      console.error('Error fetching attendance data:', error)
      toast.error('Failed to load attendance data')
    } finally {
      setAttendanceLoading(false)
    }
  }

  // Fetch attendance data when form loads
  useEffect(() => {
    if (formId) {
      fetchAttendanceData()
    }
  }, [formId])

  // Process attendance data for display
  const processAttendanceData = (): AttendanceRecord[] => {
    if (!attendanceData.length) return []
    
    // Group by student and date
    const groupedData = attendanceData.reduce((acc: any, record: any) => {
      const key = `${record.studentId}-${record.date}`
      if (!acc[key]) {
        acc[key] = {
          id: record.id,
          studentId: record.studentId,
          studentName: record.studentName,
          date: record.date,
          status: record.status,
          session: record.session,
          formId: record.formId
        }
      }
      return acc
    }, {})

    return Object.values(groupedData) as AttendanceRecord[]
  }

  const attendanceRecords = processAttendanceData()

  // Filter attendance records
  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate
    const matchesFilter = attendanceFilter === 'all' || record.status === attendanceFilter
    return matchesDate && matchesFilter
  })

  // Mark attendance
  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          formId,
          studentId,
          date: selectedDate,
          status
        })
      })
      
      if (!response.ok) throw new Error('Failed to mark attendance')
      
      toast.success(`Marked as ${status}`)
      fetchAttendanceData() // Refresh data
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Failed to mark attendance')
    }
  }

  // Bulk actions
  const markAllPresent = () => {
    submissions.forEach(submission => {
      markAttendance(submission.id, 'present')
    })
  }

  const markAllAbsent = () => {
    submissions.forEach(submission => {
      markAttendance(submission.id, 'absent')
    })
  }

  // QR Code Scanner for attendance
  const openQRScanner = () => {
    setShowQRScanner(true)
    setIsScanning(true)
    setScannedData('')
  }

  const closeQRScanner = () => {
    setShowQRScanner(false)
    setIsScanning(false)
    setScannedData('')
  }

  // Generate QR code for a specific submission
  const generateSubmissionQR = (submission: any) => {
    const qrData = {
      userId: submission.id,
      formId: formId,
      timestamp: new Date().toISOString(),
      formData: submission.fields.reduce((acc: any, field: any) => {
        acc[field.id || `field_${Math.random().toString(36).substr(2, 9)}`] = field.value
        return acc
      }, {}),
      type: "attendance"
    }
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`
    return qrCodeUrl
  }

  // Download QR code as image
  const downloadQRCode = (qrCodeUrl: string, studentName: string) => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `qr_${studentName.replace(/\s+/g, '_')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`QR code for ${studentName} downloaded!`)
  }

  const handleQRScan = (result: string) => {
    // Keep scanning active, don't close modal
    setScannedData(result)
    
    console.log('🔍 Scanned QR Code Data:', result)
    console.log('📋 Available Submissions:', submissions)
    
    // Parse the scanned data to find student information
    try {
      // Try to parse as JSON first
      let studentData = result.trim()
      let parsedData = null
      
      try {
        parsedData = JSON.parse(result)
        console.log('📄 Parsed JSON data:', parsedData)
      } catch (e) {
        // Not JSON, treat as plain text
        console.log('📝 Plain text data:', studentData)
      }
      
      // Find the student in submissions with multiple matching strategies
      let student = null
      
      if (parsedData) {
        // Try matching with parsed JSON data
        student = submissions.find(sub => 
          sub.id === parsedData.studentId ||
          sub.id === parsedData.userId ||
          sub.id === parsedData.id ||
          sub.email === parsedData.email ||
          sub.email === parsedData.studentEmail ||
          sub.name === parsedData.name ||
          sub.name === parsedData.studentName
        )
        
        // If not found by direct fields, try matching with formData
        if (!student && parsedData.formData) {
          // Look for name/email in formData values
          const formDataValues = Object.values(parsedData.formData)
          console.log('🔍 FormData values to match:', formDataValues)
          console.log('📋 Available students for formData matching:', submissions.map(s => ({ name: s.name, email: s.email })))
          
          student = submissions.find(sub => {
            const match = formDataValues.some(value => {
              const valueStr = String(value).toLowerCase()
              const nameMatch = sub.name?.toLowerCase().includes(valueStr) || valueStr.includes(sub.name?.toLowerCase() || '')
              const emailMatch = sub.email?.toLowerCase().includes(valueStr) || valueStr.includes(sub.email?.toLowerCase() || '')
              
              if (nameMatch || emailMatch) {
                console.log('✅ Matched student:', sub.name, 'with formData value:', value, 'nameMatch:', nameMatch, 'emailMatch:', emailMatch)
              }
              
              return nameMatch || emailMatch
            })
            return match
          })
        }
      }
      
      if (!student) {
        // Try matching with raw text data
        student = submissions.find(sub => 
          sub.id === studentData ||
          sub.email === studentData ||
          sub.name === studentData ||
          sub.name?.toLowerCase().includes(studentData.toLowerCase()) ||
          sub.email?.toLowerCase().includes(studentData.toLowerCase())
        )
      }
      
      if (!student) {
        // Try partial matching for names
        student = submissions.find(sub => 
          sub.name?.toLowerCase().includes(studentData.toLowerCase()) ||
          studentData.toLowerCase().includes(sub.name?.toLowerCase() || '')
        )
      }
      
      console.log('👤 Found student:', student)
      
      if (student) {
        // Check if already marked present today
        const existingRecord = attendanceRecords.find(record => 
          record.studentId === student.id && 
          record.date === selectedDate && 
          record.status === 'present'
        )
        
        if (existingRecord) {
          toast.info(`${student.name || student.email} already marked present today`)
        } else {
          // Auto-mark as present when QR code is scanned
          markAttendance(student.id, 'present')
          toast.success(`✅ Marked ${student.name || student.email} as present!`)
        }
      } else {
        // Show more detailed error with available data
        const availableStudents = submissions.map(sub => ({
          id: sub.id,
          name: sub.name,
          email: sub.email
        }))
        console.log('❌ Available students for debugging:', availableStudents)
        toast.error(`❌ Student not found: "${studentData}". Available: ${submissions.length} students`)
      }
    } catch (error) {
      console.error('❌ Error processing QR code:', error)
      toast.error('Invalid QR code format')
    }
    
    // Clear scanned data after a short delay to allow for new scans
    setTimeout(() => {
      setScannedData('')
    }, 1500)
  }

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

  const exportSubmissions = () => {
    if (!formData?.fields || submissions.length === 0) {
      toast.error('No submissions to export')
      return
    }

    // Create CSV headers from form fields
    const headers = ['Submission Date', ...formData.fields.map(field => field.label)]
    
    const csvContent = [
      headers,
      ...submissions.map(submission => [
        new Date(submission.submittedAt).toLocaleDateString(),
        ...formData.fields.map(field => {
          const fieldData = submission.fields.find(f => f.label === field.label)
          return fieldData?.value || ''
        })
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.topic}-submissions.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Submissions exported successfully!')
  }

  const toggleSubmissionSelection = (submissionId: string) => {
    setSelectedSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    )
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
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (!form || !form[0]) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <h1 className="text-xl text-red-500">Form Not Found</h1>
          <p className="text-gray-600 mb-4">The form you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const formData: FormWithFields = form[0]
  const totalSubmissions = submissions.length
  const recentSubmissions = submissions.filter(sub => 
    new Date(sub.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length
  const uniqueEmails = new Set(submissions.map(sub => sub.email).filter(Boolean)).size
  const uniqueNames = new Set(submissions.map(sub => sub.name).filter(Boolean)).size
  
  // Attendance statistics
  const todayAttendance = attendanceRecords.filter(record => record.date === selectedDate)
  const presentCount = todayAttendance.filter(record => record.status === 'present').length
  const absentCount = todayAttendance.filter(record => record.status === 'absent').length
  const lateCount = todayAttendance.filter(record => record.status === 'late').length

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
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
                <p className="text-xs text-gray-600">Form Management</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openFormLink}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Form
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

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{formData.topic}</h1>
              <p className="text-gray-600 mt-1">{formData.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={copyLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button onClick={openFormLink} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Form
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{recentSubmissions}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Emails</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueEmails}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent Today</p>
                  <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late Today</p>
                  <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="submissions">Form Submissions</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Form Submissions</CardTitle>
                  <Button onClick={exportSubmissions} variant="outline" disabled={submissions.length === 0}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-500">When users submit your form, their responses will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => {
                      const isExpanded = expandedSubmission === submission.id
                      const qrCodeUrl = generateSubmissionQR(submission)
                      const studentName = submission.name || `Student ${submission.id.slice(-6)}`
                      
                      return (
                        <div key={submission.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          {/* Main Submission Card */}
                          <div 
                            className="p-4 cursor-pointer"
                            onClick={() => setExpandedSubmission(isExpanded ? null : submission.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedSubmissions.includes(submission.id)}
                                  onCheckedChange={(checked) => {
                                    toggleSubmissionSelection(submission.id)
                                  }}
                                />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {studentName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {submission.email || 'No email provided'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <QrCode className="w-4 h-4" />
                                  <span className="hidden sm:inline">Click to view QR</span>
                                </div>
                                <Badge variant="outline">
                                  {new Date(submission.submittedAt).toLocaleDateString()}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(submission.submittedAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            
                            {/* Show form fields and values */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              {submission.fields.map((field, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium text-gray-700">{field.label}:</span>
                                  <span className="ml-2 text-gray-600">
                                    {field.type === 'checkbox' 
                                      ? (field.value ? 'Yes' : 'No')
                                      : field.value || 'Not provided'
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Expanded QR Code Section */}
                          {isExpanded && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                {/* QR Code */}
                                <div className="flex-shrink-0">
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="text-center space-y-3">
                                      <h4 className="font-medium text-gray-900">Attendance QR Code</h4>
                                      <img 
                                        src={qrCodeUrl} 
                                        alt={`QR Code for ${studentName}`}
                                        className="w-32 h-32 mx-auto"
                                      />
                                      <div className="flex items-center justify-center gap-2">
                                        <Button
                                          onClick={() => downloadQRCode(qrCodeUrl, studentName)}
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1"
                                        >
                                          <DownloadIcon className="w-3 h-3" />
                                          Download
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(qrCodeUrl)
                                            toast.success(`QR code URL for ${studentName} copied!`)
                                          }}
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1"
                                        >
                                          <Copy className="w-3 h-3" />
                                          Copy URL
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* QR Code Information */}
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">QR Code Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Student Name:</span>
                                        <span className="font-medium">{studentName}</span>
                                      </div>
                                      {submission.email && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Email:</span>
                                          <span className="font-medium">{submission.email}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Submission ID:</span>
                                        <span className="font-mono text-xs">{submission.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">QR Code Type:</span>
                                        <span className="font-medium">Attendance</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* QR Code Data Preview */}
                                  <div>
                                    <details className="text-sm">
                                      <summary className="text-gray-600 cursor-pointer hover:text-gray-800 font-medium">
                                        View QR Code Data
                                      </summary>
                                      <div className="mt-2 p-3 bg-white rounded border text-xs font-mono text-gray-600 max-h-32 overflow-y-auto">
                                        {JSON.stringify({
                                          userId: submission.id,
                                          formId: formId,
                                          formData: submission.fields.reduce((acc: any, field: any) => {
                                            acc[field.label || field.id] = field.value
                                            return acc
                                          }, {})
                                        }, null, 2)}
                                      </div>
                                    </details>
                                  </div>
                                  
                                  {/* Instructions */}
                                  <div className="bg-blue-50 rounded-lg p-3">
                                    <h5 className="font-medium text-blue-900 mb-1">How to use:</h5>
                                    <ul className="text-xs text-blue-800 space-y-1">
                                      <li>• Download or print this QR code</li>
                                      <li>• Student presents QR code for attendance</li>
                                      <li>• Scan with attendance scanner</li>
                                      <li>• Student will be automatically marked present</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Attendance Management
                  </CardTitle>
                  
                  {/* Mobile: Stack controls vertically */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Date and Filter Row */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <select
                        value={attendanceFilter}
                        onChange={(e) => setAttendanceFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
                    </div>
                    
                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={openQRScanner} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Scan className="w-4 h-4" />
                        <span className="hidden sm:inline">Scan Student QR</span>
                      </Button>
                      <Button onClick={markAllPresent} variant="outline" size="sm">
                        <span className="hidden sm:inline">Mark All Present</span>
                        <span className="sm:hidden">All Present</span>
                      </Button>
                      <Button onClick={markAllAbsent} variant="outline" size="sm">
                        <span className="hidden sm:inline">Mark All Absent</span>
                        <span className="sm:hidden">All Absent</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {attendanceLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Loading attendance data...</span>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No students registered</h3>
                    <p className="text-gray-500">Students need to submit the form before you can track attendance.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => {
                      const attendanceRecord = filteredAttendanceRecords.find(
                        record => record.studentId === submission.id
                      )
                      const currentStatus = attendanceRecord?.status as 'present' | 'absent' | 'late' | null
                      
                      return (
                        <div key={submission.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow gap-3">
                          {/* Student Info */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 truncate">
                                {submission.name || `Student ${submission.id.slice(-6)}`}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {submission.email || 'No email provided'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Badge - Mobile */}
                          {currentStatus && (
                            <div className="sm:hidden">
                              <Badge 
                                variant={currentStatus === 'present' ? 'default' : 'secondary'}
                                className={
                                  currentStatus === 'present' ? 'bg-green-100 text-green-800' :
                                  currentStatus === 'absent' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                              </Badge>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            {/* Mobile: Stack buttons vertically */}
                            <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-2">
                              <Button
                                size="sm"
                                variant={currentStatus === 'present' ? 'default' : 'outline'}
                                onClick={() => markAttendance(submission.id, 'present')}
                                className={`${
                                  currentStatus === 'present' ? 'bg-green-600 hover:bg-green-700' : ''
                                } text-xs sm:text-sm`}
                              >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">Present</span>
                                <span className="sm:hidden">P</span>
                              </Button>
                              <Button
                                size="sm"
                                variant={currentStatus === 'absent' ? 'default' : 'outline'}
                                onClick={() => markAttendance(submission.id, 'absent')}
                                className={`${
                                  currentStatus === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''
                                } text-xs sm:text-sm`}
                              >
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">Absent</span>
                                <span className="sm:hidden">A</span>
                              </Button>
                              <Button
                                size="sm"
                                variant={currentStatus === 'late' ? 'default' : 'outline'}
                                onClick={() => markAttendance(submission.id, 'late')}
                                className={`${
                                  currentStatus === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''
                                } text-xs sm:text-sm`}
                              >
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">Late</span>
                                <span className="sm:hidden">L</span>
                              </Button>
                            </div>
                            
                            {/* Desktop: Status Badge */}
                            {currentStatus && (
                              <div className="hidden sm:block">
                                <Badge 
                                  variant={currentStatus === 'present' ? 'default' : 'secondary'}
                                  className={
                                    currentStatus === 'present' ? 'bg-green-100 text-green-800' :
                                    currentStatus === 'absent' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }
                                >
                                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scan Student QR Code
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeQRScanner}
                className="h-8 w-8 p-0"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Point camera at student's QR code
                    </p>
                    <p className="text-xs text-gray-500">
                      Date: {new Date(selectedDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Continuous Scanning Active</span>
                    </div>
                  </div>
                  
                  <QRScanner
                    onScan={handleQRScan}
                    onError={(error) => {
                      toast.error(`Scanner error: ${error}`)
                      setIsScanning(false)
                    }}
                    className="w-full"
                  />
                  
                  {/* Recent Scan Display */}
                  {scannedData && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Last Scan:</span>
                      </div>
                      <p className="text-xs font-mono text-blue-700 break-all">
                        {scannedData}
                      </p>
                    </div>
                  )}
                  
                  {/* Debug Panel - Show available students */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-800">Available Students ({submissions.length}):</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {submissions.slice(0, 5).map((sub, index) => (
                        <div key={sub.id} className="text-xs text-gray-600">
                          {index + 1}. {sub.name || 'No name'} ({sub.email || 'No email'}) - ID: {sub.id.slice(-8)}
                        </div>
                      ))}
                      {submissions.length > 5 && (
                        <div className="text-xs text-gray-500 italic">
                          ... and {submissions.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Instructions for continuous scanning */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Scanner will continue until you close it. Each scan will show a toast notification.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Ready to scan student QR codes
                    </p>
                    <p className="text-xs text-gray-500">
                      Students should present their QR codes for scanning
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => setIsScanning(true)}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Start Continuous Scanning
                    </Button>
                    
                    {/* Test QR Codes */}
                    {submissions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 text-center">Test with sample data:</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {submissions.slice(0, 3).map((sub) => (
                            <Button
                              key={sub.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQRScan(sub.email || sub.name || sub.id)}
                              className="text-xs"
                            >
                              Test: {sub.name?.slice(0, 8) || sub.email?.slice(0, 8) || 'Student'}
                            </Button>
                          ))}
                        </div>
                        
                        {/* Test with actual QR format */}
                        {submissions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 text-center mb-1">Test with QR format:</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const testQR = {
                                  userId: "1753553892179",
                                  formId: formId,
                                  timestamp: new Date().toISOString(),
                                  formData: {
                                    "cmdal1vuk0002fi6csfax1so4": submissions[0].name || "Test Student",
                                    "cmdal1vuk0003fi6cv5fs269u": submissions[0].email || "test@example.com"
                                  },
                                  type: "attendance"
                                }
                                handleQRScan(JSON.stringify(testQR))
                              }}
                              className="w-full text-xs"
                            >
                              Test QR Format: {submissions[0].name || 'Student'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {!isScanning && (
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={closeQRScanner}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            )}
            
            {isScanning && (
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsScanning(false)}
                  className="flex-1"
                >
                  Pause Scanning
                </Button>
                <Button
                  onClick={closeQRScanner}
                  className="flex-1"
                >
                  Close Scanner
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
