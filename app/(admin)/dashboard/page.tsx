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
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Loading dashboard data...</p>
              </div>
            </div>
          </div>

          {/* Stats Grid - Loading Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-24 mb-1 sm:mb-2 animate-pulse"></div>
                      <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 animate-pulse"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-32 mt-1 sm:mt-2 animate-pulse"></div>
                    </div>
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-20 md:pb-8">
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your forms.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/form-generator">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"}`} />
                      <span className={`text-xs sm:text-sm ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-sm">
                Get started quickly with these common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <Link href="/form-generator">
                  <Button variant="outline" className="w-full h-auto p-3 sm:p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Create Form</span>
                  </Button>
                </Link>
                
                <Link href="/form-management">
                  <Button variant="outline" className="w-full h-auto p-3 sm:p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Manage Forms</span>
                  </Button>
                </Link>
                
                <Link href="/attendance-management">
                  <Button variant="outline" className="w-full h-auto p-3 sm:p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Attendance</span>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-auto p-3 sm:p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Forms */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Recent Forms
              </CardTitle>
              <CardDescription className="text-sm">
                Your most recently created or updated forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentForms.length > 0 ? (
                  recentForms.map((form) => (
                    <div key={form.id} className="p-3 sm:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{form.title}</h4>
                            <Badge variant={form.status === 'active' ? 'default' : 'secondary'} className="text-xs w-fit">
                              {form.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
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
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Link href={`/form-management/${form.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </Link>
                          <Link href={`/form-management/${form.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 mb-4">No forms created yet</p>
                    <Link href="/form-generator">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Form
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-sm">
                Latest submissions and form updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentForms.length > 0 ? (
                  recentForms.slice(0, 3).map((form, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 sm:p-4 border border-gray-100 rounded-lg">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          New submission to <span className="font-semibold">{form.title}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {form.lastSubmission} • {form.submissions} total submissions
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-xs text-gray-400 mt-1">Create forms to see activity here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 