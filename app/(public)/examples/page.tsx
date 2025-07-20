import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, ExternalLink, Users, FileText, Calendar, Mail, MapPin, GraduationCap, Building2, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ExampleFormPreview from "@/components/examples/example-form-preview";


const exampleForms = [
  {
    id: "student-registration",
    title: "Student Registration",
    description: "Complete student enrollment form with personal details, course selection, and emergency contacts",
    category: "Education",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Student ID", type: "text", required: true },
      { label: "Email Address", type: "email", required: true },
      { label: "Phone Number", type: "text", required: true },
      { label: "Date of Birth", type: "date", required: true },
      { label: "Course/Program", type: "select", required: true },
      { label: "Emergency Contact", type: "text", required: true },
      { label: "Medical Information", type: "textarea", required: false },
    ],
    iconName: "graduation-cap",
    color: "from-blue-500 to-indigo-500",
    submissions: 2156,
    features: ["QR Code Generation", "Attendance Tracking", "Data Export"]
  },
  {
    id: "event-registration",
    title: "Event Registration",
    description: "Professional event registration form for conferences, workshops, and meetups",
    category: "Events",
    fields: [
      { label: "First Name", type: "text", required: true },
      { label: "Last Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Company/Organization", type: "text", required: false },
      { label: "Job Title", type: "text", required: false },
      { label: "Dietary Restrictions", type: "text", required: false },
      { label: "Special Accommodations", type: "textarea", required: false },
      { label: "I agree to receive updates", type: "checkbox", required: false },
    ],
    iconName: "calendar",
    color: "from-green-500 to-emerald-500",
    submissions: 1892,
    features: ["QR Check-in", "Attendee Management", "Real-time Analytics"]
  },
  {
    id: "job-application",
    title: "Job Application",
    description: "Comprehensive job application form for hiring managers and HR departments",
    category: "HR",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Phone", type: "text", required: true },
      { label: "Position Applied For", type: "text", required: true },
      { label: "Resume/CV", type: "file", required: true },
      { label: "Cover Letter", type: "textarea", required: false },
      { label: "Years of Experience", type: "number", required: true },
      { label: "Available Start Date", type: "date", required: true },
      { label: "Expected Salary", type: "number", required: false },
    ],
    iconName: "users",
    color: "from-purple-500 to-pink-500",
    submissions: 1567,
    features: ["File Upload", "Application Tracking", "Candidate Database"]
  },
  {
    id: "customer-feedback",
    title: "Customer Feedback",
    description: "Collect valuable customer insights and feedback for product improvement",
    category: "Marketing",
    fields: [
      { label: "Customer Name", type: "text", required: false },
      { label: "Email", type: "email", required: false },
      { label: "Product/Service Used", type: "text", required: true },
      { label: "Rating (1-10)", type: "number", required: true },
      { label: "What did you like most?", type: "textarea", required: false },
      { label: "What could we improve?", type: "textarea", required: false },
      { label: "Would you recommend us?", type: "checkbox", required: false },
      { label: "Contact for follow-up", type: "checkbox", required: false },
    ],
    iconName: "file-text",
    color: "from-orange-500 to-red-500",
    submissions: 3341,
    features: ["Rating System", "Sentiment Analysis", "Customer Insights"]
  },
  {
    id: "product-order",
    title: "Product Order Form",
    description: "Streamlined order form for e-commerce and service businesses",
    category: "E-commerce",
    fields: [
      { label: "Customer Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Phone", type: "text", required: true },
      { label: "Shipping Address", type: "textarea", required: true },
      { label: "Product Selection", type: "select", required: true },
      { label: "Quantity", type: "number", required: true },
      { label: "Special Instructions", type: "textarea", required: false },
      { label: "I agree to terms", type: "checkbox", required: true },
    ],
    iconName: "shopping-cart",
    color: "from-teal-500 to-cyan-500",
    submissions: 1756,
    features: ["Order Tracking", "Inventory Management", "Payment Integration"]
  },
  {
    id: "volunteer-signup",
    title: "Volunteer Signup",
    description: "Organize community events and volunteer programs efficiently",
    category: "Community",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Phone", type: "text", required: true },
      { label: "Age", type: "number", required: true },
      { label: "Preferred Role", type: "select", required: true },
      { label: "Available Dates", type: "text", required: true },
      { label: "Previous Experience", type: "textarea", required: false },
      { label: "Emergency Contact", type: "text", required: true },
    ],
    iconName: "heart",
    color: "from-indigo-500 to-purple-500",
    submissions: 1423,
    features: ["Role Assignment", "Schedule Management", "Volunteer Database"]
  },
  {
    id: "contact-form",
    title: "Contact Form",
    description: "Professional contact form for businesses and personal websites",
    category: "Business",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Email Address", type: "email", required: true },
      { label: "Phone Number", type: "text", required: false },
      { label: "Subject", type: "text", required: true },
      { label: "Message", type: "textarea", required: true },
      { label: "Preferred Contact Method", type: "select", required: false },
    ],
    iconName: "mail",
    color: "from-gray-500 to-slate-500",
    submissions: 2247,
    features: ["Lead Capture", "Auto-Response", "CRM Integration"]
  },
  {
    id: "health-survey",
    title: "Health Survey",
    description: "Comprehensive health assessment form for medical professionals",
    category: "Healthcare",
    fields: [
      { label: "Patient Name", type: "text", required: true },
      { label: "Date of Birth", type: "date", required: true },
      { label: "Emergency Contact", type: "text", required: true },
      { label: "Medical History", type: "textarea", required: false },
      { label: "Current Medications", type: "textarea", required: false },
      { label: "Allergies", type: "text", required: false },
      { label: "Symptoms", type: "textarea", required: true },
      { label: "Consent for Treatment", type: "checkbox", required: true },
    ],
    iconName: "heart",
    color: "from-red-500 to-pink-500",
    submissions: 892,
    features: ["HIPAA Compliant", "Medical Records", "Appointment Scheduling"]
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
          📋 Professional Form Templates
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Ready-to-Use Form Templates
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Choose from our collection of professionally designed templates for various industries. 
          Each template includes QR code generation and attendance tracking capabilities.
        </p>
      </section>

      {/* Examples Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleForms.map((form) => (
            <Card key={form.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${form.color} rounded-lg flex items-center justify-center`}>
                    {form.iconName === "mail" && <Mail className="w-6 h-6 text-white" />}
                    {form.iconName === "calendar" && <Calendar className="w-6 h-6 text-white" />}
                    {form.iconName === "users" && <Users className="w-6 h-6 text-white" />}
                    {form.iconName === "file-text" && <FileText className="w-6 h-6 text-white" />}
                    {form.iconName === "map-pin" && <MapPin className="w-6 h-6 text-white" />}
                    {form.iconName === "graduation-cap" && <GraduationCap className="w-6 h-6 text-white" />}
                    {form.iconName === "building2" && <Building2 className="w-6 h-6 text-white" />}
                    {form.iconName === "heart" && <Heart className="w-6 h-6 text-white" />}
                    {form.iconName === "shopping-cart" && <ShoppingCart className="w-6 h-6 text-white" />}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {form.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-gray-800">
                  {form.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {form.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{form.fields.length} fields</span>
                    <span>{form.submissions.toLocaleString()} submissions</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.fields.slice(0, 3).map((field, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                    ))}
                    {form.fields.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{form.fields.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {form.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <ExampleFormPreview form={form}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      <Eye className="w-4 h-4 mr-2" />
                      Try It Live
                    </Button>
                  </ExampleFormPreview>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-0 shadow-2xl">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to create your own form?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Use these templates as inspiration or start from scratch with our powerful form builder. 
              All forms include QR code generation and attendance tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                  Start Creating
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/qr-demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">
                  Try QR Demo
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 