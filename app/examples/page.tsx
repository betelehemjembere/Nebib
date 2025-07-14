import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, ExternalLink, Users, FileText, Calendar, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ExampleFormPreview from "@/components/examples/example-form-preview";

const exampleForms = [
  {
    id: "contact-form",
    title: "Contact Form",
    description: "A professional contact form for businesses and personal websites",
    category: "Business",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Email Address", type: "email", required: true },
      { label: "Phone Number", type: "text", required: false },
      { label: "Subject", type: "text", required: true },
      { label: "Message", type: "textarea", required: true },
    ],
    iconName: "mail",
    color: "from-blue-500 to-indigo-500",
    submissions: 1247,
  },
  {
    id: "event-registration",
    title: "Event Registration",
    description: "Perfect for conferences, workshops, and meetups",
    category: "Events",
    fields: [
      { label: "First Name", type: "text", required: true },
      { label: "Last Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Company", type: "text", required: false },
      { label: "Job Title", type: "text", required: false },
      { label: "Dietary Restrictions", type: "text", required: false },
      { label: "I agree to receive updates", type: "checkbox", required: false },
    ],
    iconName: "calendar",
    color: "from-green-500 to-emerald-500",
    submissions: 892,
  },
  {
    id: "job-application",
    title: "Job Application",
    description: "Comprehensive job application form for hiring managers",
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
    ],
    iconName: "users",
    color: "from-purple-500 to-pink-500",
    submissions: 567,
  },
  {
    id: "feedback-survey",
    title: "Customer Feedback",
    description: "Collect valuable customer insights and feedback",
    category: "Marketing",
    fields: [
      { label: "Customer Name", type: "text", required: false },
      { label: "Email", type: "email", required: false },
      { label: "Product/Service Used", type: "text", required: true },
      { label: "Rating (1-10)", type: "number", required: true },
      { label: "What did you like most?", type: "textarea", required: false },
      { label: "What could we improve?", type: "textarea", required: false },
      { label: "Would you recommend us?", type: "checkbox", required: false },
    ],
    iconName: "file-text",
    color: "from-orange-500 to-red-500",
    submissions: 2341,
  },
  {
    id: "order-form",
    title: "Product Order Form",
    description: "Streamlined order form for e-commerce and services",
    category: "E-commerce",
    fields: [
      { label: "Customer Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Phone", type: "text", required: true },
      { label: "Shipping Address", type: "textarea", required: true },
      { label: "Product Selection", type: "text", required: true },
      { label: "Quantity", type: "number", required: true },
      { label: "Special Instructions", type: "textarea", required: false },
      { label: "I agree to terms", type: "checkbox", required: true },
    ],
    iconName: "map-pin",
    color: "from-teal-500 to-cyan-500",
    submissions: 756,
  },
  {
    id: "volunteer-signup",
    title: "Volunteer Signup",
    description: "Organize community events and volunteer programs",
    category: "Community",
    fields: [
      { label: "Full Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Phone", type: "text", required: true },
      { label: "Age", type: "number", required: true },
      { label: "Preferred Role", type: "text", required: true },
      { label: "Available Dates", type: "text", required: true },
      { label: "Previous Experience", type: "textarea", required: false },
      { label: "Emergency Contact", type: "text", required: true },
    ],
    iconName: "users",
    color: "from-indigo-500 to-purple-500",
    submissions: 423,
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Header */}
      <header className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="NEBIB Logo"
                width={20}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-800">NEBIB</span>
            </div>
          </div>
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
          📋 Form Templates & Examples
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Explore Our Form Templates
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover professionally designed form templates for various use cases. 
          Click on any template to see it in action and get inspired for your own forms.
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
              Use these templates as inspiration or start from scratch with our powerful form builder
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                  Start Creating
                  <ExternalLink className="w-5 h-5 ml-2" />
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

      {/* Footer */}
      <footer className="border-t border-blue-200 bg-white/60">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="NEBIB Logo"
                width={24}
                height={24}
                className="w-8 h-8"
              />
              <span className="font-semibold text-gray-800">NEBIB</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 NEBIB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 