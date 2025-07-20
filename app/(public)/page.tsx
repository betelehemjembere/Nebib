
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Users, BarChart3, QrCode, FileText, Calendar, Smartphone, Database, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
          🚀 Complete Form & Attendance Management Platform
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Build Forms, Track Attendance
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">With QR Technology</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto px-4">
          Create professional forms in minutes, generate QR codes for instant attendance tracking, 
          and get real-time analytics. Perfect for schools, events, and businesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/sign-in">
            <Button size="lg" className="text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full sm:w-auto">
              Start Creating
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link href="/examples" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="text-lg px-6 sm:px-8 py-4 sm:py-6 border-blue-300 text-blue-700 hover:bg-blue-50 w-full">
                View Templates
              </Button>
            </Link>
            <Link href="/qr-demo" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="text-lg px-6 sm:px-8 py-4 sm:py-6 border-green-300 text-green-700 hover:bg-green-50 w-full">
                Try QR Demo
              </Button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="text-lg px-6 sm:px-8 py-4 sm:py-6 border-purple-300 text-purple-700 hover:bg-purple-50 w-full">
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Everything you need for modern form management
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From drag-and-drop form building to QR-based attendance tracking, 
            NEBIB provides a complete solution for your data collection needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Smart Form Builder</CardTitle>
              <CardDescription className="text-gray-600">
                Create professional forms with our intuitive drag-and-drop interface. 
                Support for text, email, date, file uploads, and more field types.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">QR Code Attendance</CardTitle>
              <CardDescription className="text-gray-600">
                Generate QR codes for instant attendance tracking. 
                Scan with mobile devices for real-time attendance marking.
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
                Track form submissions, attendance rates, and generate detailed reports 
                with beautiful visualizations and insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Mobile Optimized</CardTitle>
              <CardDescription className="text-gray-600">
                Fully responsive design works perfectly on all devices. 
                QR scanning optimized for mobile cameras and tablets.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Secure Data Storage</CardTitle>
              <CardDescription className="text-gray-600">
                Enterprise-grade security with encrypted data storage, 
                user authentication, and privacy protection.
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
                Share forms with anyone via public links. 
                No registration required for form submissions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            How NEBIB Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple three-step process to get started with your forms and attendance tracking
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Create Your Form</h3>
            <p className="text-gray-600">
              Use our drag-and-drop builder to create professional forms with various field types. 
              Choose from templates or start from scratch.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Generate QR Codes</h3>
            <p className="text-gray-600">
              Automatically generate QR codes for form submissions. 
              Users can download and save their QR codes for attendance tracking.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Track & Analyze</h3>
            <p className="text-gray-600">
              Scan QR codes to mark attendance instantly. 
              View real-time analytics and generate detailed reports.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Perfect for Every Use Case
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're managing a school, organizing events, or running a business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">Schools & Universities</h3>
              <p className="text-sm text-gray-600">Student registration, attendance tracking, and course evaluations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">Events & Conferences</h3>
              <p className="text-sm text-gray-600">Event registration, check-ins, and attendee management</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">Businesses</h3>
              <p className="text-sm text-gray-600">Employee surveys, customer feedback, and lead generation</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">Healthcare</h3>
              <p className="text-sm text-gray-600">Patient forms, appointment scheduling, and health surveys</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-0 shadow-2xl">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your form management?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who are already building amazing forms and tracking attendance with NEBIB
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg px-6 sm:px-8 py-4 sm:py-6 bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button variant="outline" size="lg" className="text-lg px-6 sm:px-8 py-4 sm:py-6 border-white text-blue-600 hover:bg-white/10 w-full sm:w-auto">
                  Explore Templates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 