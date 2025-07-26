"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, QrCode, Camera, Download, Copy, Check, RefreshCw, Smartphone, Users, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import QRGenerator from "@/components/qr-code/qr-generator";
import QRScanner from "@/components/qr-code/qr-scanner";
import { toast } from "sonner";


export default function QRDemoPage() {
  const [activeTab, setActiveTab] = useState("generator");
  const [scanHistory, setScanHistory] = useState<Array<{ data: string; timestamp: string; status: string }>>([]);

  const handleScan = (qrData: string) => {
    const newScan = {
      data: qrData,
      timestamp: new Date().toLocaleString(),
      status: "Success"
    };
    setScanHistory(prev => [newScan, ...prev.slice(0, 9)]); // Keep last 10 scans
    toast.success("QR Code scanned successfully!");
  };

  const handleScanError = (error: string) => {
    toast.error(`Scan error: ${error}`);
  };

  const demoFormData = {
    name: "John Doe",
    email: "john.doe@example.com",
    studentId: "STU2024001",
    course: "Computer Science",
    department: "Engineering"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-sm sm:text-base">
          📱 QR Code Technology Demo
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent px-4">
          Experience QR Code Magic
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Test our advanced QR code generation and admin-side scanning features. Generate QR codes for students 
          and experience the admin scanning process for instant attendance marking.
        </p>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2 text-sm sm:text-base">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Generator</span>
              <span className="sm:hidden">Generator</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2 text-sm sm:text-base">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">QR Scanner</span>
              <span className="sm:hidden">Scanner</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* QR Generator */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <QrCode className="w-5 h-5" />
                    Generate QR Code
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Create a QR code with student form submission data for attendance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRGenerator
                    userId="demo-user-123"
                    formId="demo-form-456"
                    formData={demoFormData}
                    className="border-0 shadow-none"
                  />
                </CardContent>
              </Card>

              {/* Demo Data */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Users className="w-5 h-5" />
                    Demo Form Data
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    This is the data that will be embedded in the QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-600 break-words">{demoFormData.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-600 break-words">{demoFormData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Student ID</label>
                        <p className="text-sm text-gray-600 break-words">{demoFormData.studentId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Course</label>
                        <p className="text-sm text-gray-600 break-words">{demoFormData.course}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">QR Code Data Structure:</h4>
                      <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap break-words">
{JSON.stringify({
  userId: "demo-user-123",
  formId: "demo-form-456",
  timestamp: "2025-01-20T12:00:00.000Z",
  formData: demoFormData,
  type: "attendance"
}, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* QR Scanner */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Camera className="w-5 h-5" />
                    Scan QR Code
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Use your camera to scan QR codes and mark attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QRScanner
                    onScan={handleScan}
                    onError={handleScanError}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Scan History */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Clock className="w-5 h-5" />
                    Scan History
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Recent QR code scans and their results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scanHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm sm:text-base">No scans yet. Try scanning a QR code!</p>
                      </div>
                    ) : (
                      scanHistory.map((scan, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <Badge variant="outline" className="text-xs w-fit">
                              {scan.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{scan.timestamp}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 font-mono break-words">
                            {scan.data.length > 50 ? `${scan.data.substring(0, 50)}...` : scan.data}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800 px-4">
            QR Code Features
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover the power of QR code technology in form management and attendance tracking
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Instant Generation</CardTitle>
              <CardDescription className="text-gray-600">
                Generate QR codes automatically after form submission with embedded user and form data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Real-time Scanning</CardTitle>
              <CardDescription className="text-gray-600">
                Scan QR codes with mobile devices for instant attendance marking and data retrieval
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Mobile Optimized</CardTitle>
              <CardDescription className="text-gray-600">
                Optimized for mobile cameras with automatic focus and error handling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Download & Share</CardTitle>
              <CardDescription className="text-gray-600">
                Download QR codes as PNG images or copy data to clipboard for easy sharing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Regenerate & Update</CardTitle>
              <CardDescription className="text-gray-600">
                Regenerate QR codes with updated data or create new ones for different purposes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Validation & Security</CardTitle>
              <CardDescription className="text-gray-600">
                Built-in validation, duplicate scan prevention, and secure data handling
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-0 shadow-2xl">
          <CardContent className="text-center py-12 sm:py-16 px-4 sm:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to implement QR codes in your forms?
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
              Start creating forms with QR code generation and attendance tracking capabilities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/examples">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto">
                  View Templates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 