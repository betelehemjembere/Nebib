"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Users, 
  Calendar, 
  QrCode, 
  Camera, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Settings,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Shield,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HelpPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("getting-started");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Help & Guidelines</h1>
                <p className="text-xs hidden sm:block sm:text-sm text-gray-500 truncate">Learn how to use the form and attendance management system</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Quick Guide</span>
                <span className="sm:hidden">Guide</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 sm:top-24">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Help Topics</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-0.5 sm:space-y-1">
                  {[
                    { id: "getting-started", title: "Getting Started", icon: BookOpen },
                    { id: "form-builder", title: "Form Builder", icon: Plus },
                    { id: "attendance", title: "Attendance Management", icon: Calendar },
                    { id: "qr-codes", title: "QR Code System", icon: QrCode },
                    { id: "submissions", title: "Form Submissions", icon: FileText },
                    { id: "troubleshooting", title: "Troubleshooting", icon: Settings }
                  ].map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 transition-colors ${
                          activeTab === section.id
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-xs sm:text-sm">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Getting Started */}
            {activeTab === "getting-started" && (
                              <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">Welcome to Form & Attendance Manager</h3>
                      <p className="text-gray-600">
                        This system helps you create forms, collect responses, and manage attendance using QR codes.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs sm:text-sm font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">Create Your First Form</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Use the form builder to create custom forms with various field types.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs sm:text-sm font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">Share with Participants</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Share the form link with students or participants to collect responses.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs sm:text-sm font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">Generate QR Codes</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Create QR codes for each participant for easy attendance tracking.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs sm:text-sm font-semibold">4</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">Track Attendance</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Use the QR scanner or manual marking to track attendance.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">Quick Actions</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <Button 
                          onClick={() => router.push('/form-generator')}
                          className="w-full justify-start gap-3"
                        >
                          <Plus className="w-4 h-4" />
                          Create New Form
                        </Button>
                        
                        <Button 
                          onClick={() => router.push('/dashboard')}
                          variant="outline"
                          className="w-full justify-start gap-3"
                        >
                          <FileText className="w-4 h-4" />
                          View All Forms
                        </Button>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Need Help?</h4>
                        <p className="text-xs sm:text-sm text-blue-800 mb-3">
                          If you need assistance, check the troubleshooting section or contact support.
                        </p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-700">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>support@example.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Builder */}
            {activeTab === "form-builder" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Form Builder Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Creating Forms</h3>
                      <p className="text-gray-600">
                        The form builder allows you to create custom forms with various field types.
                        Everything is inline and real-time.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-sm font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Set Form Details</h4>
                            <p className="text-sm text-gray-600">Enter the form title and description at the top of the builder.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-sm font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Add Fields</h4>
                            <p className="text-sm text-gray-600">Click "Add Field" to add different types of input fields.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-sm font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Organize with Sections</h4>
                            <p className="text-sm text-gray-600">Group related fields into sections for better organization.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-sm font-semibold">4</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Publish Form</h4>
                            <p className="text-sm text-gray-600">Click "Publish" to make your form live and shareable.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Field Types Available</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="font-medium">Text Input</span>
                          <span className="text-gray-500">- Single line text</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="font-medium">Number Input</span>
                          <span className="text-gray-500">- Numeric values</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-purple-500 rounded"></div>
                          <span className="font-medium">Date Picker</span>
                          <span className="text-gray-500">- Date selection</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-orange-500 rounded"></div>
                          <span className="font-medium">Checkbox</span>
                          <span className="text-gray-500">- Yes/No options</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="font-medium">Dropdown</span>
                          <span className="text-gray-500">- Multiple choice</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attendance Management */}
            {activeTab === "attendance" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Attendance Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Managing Attendance</h3>
                      <p className="text-gray-600">
                        Track attendance using QR codes or manual marking. The system supports multiple attendance statuses.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Select Date</h4>
                            <p className="text-sm text-gray-600">Choose the date for which you want to track attendance.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">QR Code Scanning</h4>
                            <p className="text-sm text-gray-600">Use the QR scanner to automatically mark students present.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Manual Marking</h4>
                            <p className="text-sm text-gray-600">Manually mark students as present, absent, or late.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Attendance Statuses</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-green-900">Present</div>
                            <div className="text-sm text-green-700">Student attended the session</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-medium text-red-900">Absent</div>
                            <div className="text-sm text-red-700">Student did not attend</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <div>
                            <div className="font-medium text-yellow-900">Late</div>
                            <div className="text-sm text-yellow-700">Student arrived late</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QR Code System */}
            {activeTab === "qr-codes" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">How QR Codes Work</h3>
                      <p className="text-gray-600">
                        Each student gets a unique QR code containing their submission data.
                        When scanned, it automatically marks them present.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-purple-600 text-sm font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Generate QR Codes</h4>
                            <p className="text-sm text-gray-600">Click on any submission card to view and download the student's QR code.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-purple-600 text-sm font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Distribute to Students</h4>
                            <p className="text-sm text-gray-600">Print or share QR codes with students for attendance.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-purple-600 text-sm font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Scan for Attendance</h4>
                            <p className="text-sm text-gray-600">Use the QR scanner to scan student codes during class.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">QR Code Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Shield className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium">Unique Identification</div>
                            <div className="text-sm text-gray-600">Each QR code contains student-specific data</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Zap className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium">Instant Processing</div>
                            <div className="text-sm text-gray-600">Attendance marked immediately upon scanning</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Download className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium">Easy Distribution</div>
                            <div className="text-sm text-gray-600">Download and print QR codes easily</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Submissions */}
            {activeTab === "submissions" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Form Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Managing Submissions</h3>
                      <p className="text-gray-600">
                        View, export, and manage all form submissions. Each submission can be expanded to show QR codes.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-600 text-sm font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">View All Submissions</h4>
                            <p className="text-sm text-gray-600">See all responses in a clean, organized list.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-600 text-sm font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Expand for QR Codes</h4>
                            <p className="text-sm text-gray-600">Click any submission to view and download QR codes.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-orange-600 text-sm font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Export Data</h4>
                            <p className="text-sm text-gray-600">Export submissions as CSV for external analysis.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Submission Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Search className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium">Search & Filter</div>
                            <div className="text-sm text-gray-600">Find submissions quickly</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Download className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium">Export Options</div>
                            <div className="text-sm text-gray-600">Download as CSV format</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <QrCode className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium">QR Code Access</div>
                            <div className="text-sm text-gray-600">Generate attendance QR codes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Troubleshooting */}
            {activeTab === "troubleshooting" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Troubleshooting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Common Issues</h3>
                      
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-red-600 mb-2">QR Code Not Scanning</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            The QR scanner can't read the student's QR code.
                          </p>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div><strong>Solutions:</strong></div>
                            <div>• Ensure good lighting</div>
                            <div>• Keep QR code clean and undamaged</div>
                            <div>• Try manual attendance marking</div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-red-600 mb-2">Student Not Found</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            QR code scans but shows "Student not found" error.
                          </p>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div><strong>Solutions:</strong></div>
                            <div>• Verify student submitted the form</div>
                            <div>• Check if using correct QR code</div>
                            <div>• Use manual attendance marking</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Contact Support</h3>
                      <p className="text-gray-600">
                        If you're still experiencing issues, contact our support team.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Email Support</div>
                            <div className="text-sm text-blue-700">support@example.com</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium">Live Chat</div>
                            <div className="text-sm text-green-700">Available 24/7</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <Phone className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium">Phone Support</div>
                            <div className="text-sm text-purple-700">+1 (555) 123-4567</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 