"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDashboardData } from "./_hooks/dashboard_hooks";

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Loading dashboard data...</p>
              </div>
            </div>
          </div>

          {/* Stats Grid - Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  const safeStat = (val: any, suffix = "") => (typeof val === "number" && isFinite(val) ? val : 0) + suffix;
  const safePercent = (val: any) => (typeof val === "number" && isFinite(val) ? `${val}%` : "0%");
  const safeTrend = (val: any) => (typeof val === "number" && isFinite(val) ? `${val >= 0 ? "+" : ""}${val}%` : "0%");

  const stats = [
    {
      title: "Total Forms",
      value: safeStat(dashboardData?.stats.totalForms),
      change: safeTrend(dashboardData?.stats.formTrend),
      changeType: (dashboardData?.stats.formTrend ?? 0) >= 0 ? "positive" : "negative",
      icon: FileText,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Forms",
      value: safeStat(dashboardData?.stats.activeForms),
      change: safeTrend(dashboardData?.stats.formTrend),
      changeType: (dashboardData?.stats.formTrend ?? 0) >= 0 ? "positive" : "negative",
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Submissions",
      value: safeStat(dashboardData?.stats.totalSubmissions),
      change: safeTrend(dashboardData?.stats.submissionTrend),
      changeType: (dashboardData?.stats.submissionTrend ?? 0) >= 0 ? "positive" : "negative",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Response Rate",
      value: safePercent(dashboardData?.stats.avgResponseRate),
      change: safeTrend(dashboardData?.stats.responseRateTrend),
      changeType: (dashboardData?.stats.responseRateTrend ?? 0) >= 0 ? "positive" : "negative",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const recentForms = dashboardData?.recentForms || [];

  const quickActions = [
    {
      title: "Create New Form",
      description: "Start building a new form from scratch",
      icon: Plus,
      href: "/form-generator",
      color: "from-blue-500 to-purple-600"
    },
    // {
    //   title: "View Analytics",
    //   description: "Check form performance and insights",
    //   icon: BarChart3,
    //   href: "/analytics",
    //   color: "from-green-500 to-teal-600"
    // },
    {
      title: "Manage Forms",
      description: "Edit, duplicate, or delete existing forms",
      icon: Edit,
      href: "/form-management",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Attendance Tracking",
      description: "Monitor attendance and check-ins",
      icon: Users,
      href: "/attendance-management",
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your forms.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Sparkles className="w-3 h-3 mr-1" />
                Free Plan
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Forms
              </CardTitle>
              <CardDescription>
                Your most recently created or updated forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentForms.length > 0 ? (
                  recentForms.map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{form.title}</h4>
                          <Badge variant={form.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {form.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {form.submissions} submissions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {form.lastSubmission}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/form-management/${form.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/form-management/${form.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No forms created yet</p>
                    <Link href="/form-generator">
                      <Button className="mt-3">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Form
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href="/form-management">
                  <Button variant="outline" className="w-full">
                    View All Forms
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New form submission</p>
                    <p className="text-xs text-gray-500">Employee Feedback Survey received a new response</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Form created</p>
                    <p className="text-xs text-gray-500">Customer Satisfaction Form was created</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Form published</p>
                    <p className="text-xs text-gray-500">Event Registration form is now live</p>
                    <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Attendance updated</p>
                    <p className="text-xs text-gray-500">Weekly attendance report generated</p>
                    <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 