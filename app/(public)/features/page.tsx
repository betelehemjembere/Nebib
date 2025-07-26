import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, QrCode, BarChart3, Users, Shield, Smartphone, Database, Globe, CheckCircle, Calendar, Mail, Settings, Download, Upload, Eye, Clock, TrendingUp, Camera } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
          ⚡ Powerful Features
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Everything You Need for Modern Form Management
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          From intuitive form building to advanced QR code attendance tracking, 
          NEBIB provides a complete solution for your data collection and management needs.
        </p>
      </section>

      {/* Form Builder Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Smart Form Builder
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create professional forms with our intuitive drag-and-drop interface
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Drag & Drop Interface</CardTitle>
              <CardDescription className="text-gray-600">
                Intuitive form builder with drag-and-drop functionality. Add, remove, and reorder fields with ease.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Multiple Field Types</CardTitle>
              <CardDescription className="text-gray-600">
                Support for text, email, number, date, checkbox, textarea, select dropdowns, and file uploads.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Live Preview</CardTitle>
              <CardDescription className="text-gray-600">
                See your form as you build it with real-time preview and responsive design testing.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">File Upload Support</CardTitle>
              <CardDescription className="text-gray-600">
                Allow users to upload documents, images, and other files with size and type restrictions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Validation Rules</CardTitle>
              <CardDescription className="text-gray-600">
                Set required fields, format validation, and custom validation rules for data integrity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Public Forms</CardTitle>
              <CardDescription className="text-gray-600">
                Share forms with anyone via public links. No registration required for form submissions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* QR Code Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            QR Code Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revolutionary QR code system for instant attendance tracking and data management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Automatic Generation</CardTitle>
              <CardDescription className="text-gray-600">
                QR codes are automatically generated after form submission with embedded user and form data.
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
                Scan QR codes with mobile devices for instant attendance marking and data retrieval.
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
                Optimized for mobile cameras with automatic focus, error handling, and responsive design.
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
                Download QR codes as PNG images or copy data to clipboard for easy sharing and storage.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Secure & Validated</CardTitle>
              <CardDescription className="text-gray-600">
                Built-in validation, duplicate scan prevention, and secure data handling with encryption.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Time-based Status</CardTitle>
              <CardDescription className="text-gray-600">
                Automatic attendance status determination based on scan time (present, late, absent).
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Attendance Management Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Attendance Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive attendance tracking with multiple view modes and real-time updates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Multiple View Modes</CardTitle>
              <CardDescription className="text-gray-600">
                Card view, calendar view, and QR scanner view for different attendance management needs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Calendar Interface</CardTitle>
              <CardDescription className="text-gray-600">
                Visual calendar interface for marking and reviewing attendance across multiple dates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Real-time Analytics</CardTitle>
              <CardDescription className="text-gray-600">
                Live attendance statistics, trends, and insights with visual charts and reports.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Attendance Trends</CardTitle>
              <CardDescription className="text-gray-600">
                Track attendance patterns, identify trends, and generate detailed attendance reports.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Export & Reports</CardTitle>
              <CardDescription className="text-gray-600">
                Export attendance data in multiple formats and generate comprehensive reports.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Data Management</CardTitle>
              <CardDescription className="text-gray-600">
                Secure storage, backup, and management of all attendance and form data.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Analytics & Insights */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Analytics & Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful analytics and reporting tools to understand your data better
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Form Analytics</CardTitle>
              <CardDescription className="text-gray-600">
                Track form submissions, completion rates, and user engagement metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Performance Metrics</CardTitle>
              <CardDescription className="text-gray-600">
                Monitor system performance, response times, and user experience metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Data Export</CardTitle>
              <CardDescription className="text-gray-600">
                Export data in CSV, Excel, and JSON formats for external analysis and reporting.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-0 shadow-2xl">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to experience all these features?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Start building forms, generating QR codes, and tracking attendance with NEBIB today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/qr-demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-blue-600 text-blue-600 hover:bg-blue-50">
                  Try QR Demo
                </Button>
              </Link>
              <Link href="/examples">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-blue-600 text-blue-600 hover:bg-blue-50">
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