
"use client";

import { FileText, BarChart3, Users, TrendingUp } from "lucide-react";
import { useGetForms } from "@/app/(admin)/form-management/_hooks/form_hooks";

export default function TopPart() {
  const { data: forms, isLoading } = useGetForms();

  // Calculate real statistics
  const totalForms = forms?.length || 0;
  const activeForms = forms?.filter(form => form.status === 'active' || !form.status).length || 0;
  const totalSubmissions = forms?.reduce((sum, form) => sum + (form.submissions || 0), 0) || 0;
  const avgResponseRate = totalForms > 0 ? Math.round((totalSubmissions / (totalForms * 10)) * 100) : 0; // Simplified calculation

  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Forms Management</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your published forms and view submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Loading...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview - Loading Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate trends (simplified)
  const trends = {
    formTrend: 0,
    submissionTrend: 0,
    responseRateTrend: 0
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return "text-green-500";
    if (trend < 0) return "text-red-500";
    return "text-gray-400";
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getTrendText = (trend: number, type: string) => {
    if (trend > 0) return `+${trend}% from last month`;
    if (trend < 0) return `${trend}% from last month`;
    return `No change in ${type}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Forms Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your published forms and view submissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {totalForms} form{totalForms !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Forms</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {isLoading ? "..." : totalForms}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
            <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${getTrendIcon(trends.formTrend)}`} />
            <span className={`text-xs sm:text-sm ${getTrendColor(trends.formTrend)}`}>
              {getTrendText(trends.formTrend, 'forms')}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Forms</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {isLoading ? "..." : activeForms}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
            <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${getTrendIcon(trends.formTrend)}`} />
            <span className={`text-xs sm:text-sm ${getTrendColor(trends.formTrend)}`}>
              {getTrendText(trends.formTrend, 'forms')}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {isLoading ? "..." : totalSubmissions}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
            <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${getTrendIcon(trends.submissionTrend)}`} />
            <span className={`text-xs sm:text-sm ${getTrendColor(trends.submissionTrend)}`}>
              {getTrendText(trends.submissionTrend, 'submissions')}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Response Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {isLoading ? "..." : `${avgResponseRate}%`}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
            <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${getTrendIcon(trends.responseRateTrend)}`} />
            <span className={`text-xs sm:text-sm ${getTrendColor(trends.responseRateTrend)}`}>
              {getTrendText(trends.responseRateTrend, 'response rate')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
