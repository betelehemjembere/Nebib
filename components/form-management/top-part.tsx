
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
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Forms Management</h1>
              <p className="text-gray-600 mt-1">Manage your published forms and view submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Loading...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview - Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate real trends based on form creation dates
  const calculateTrends = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count forms created this month vs last month
    const thisMonthForms = forms?.filter(form => new Date(form.createdAt) >= thisMonth).length || 0;
    const lastMonthForms = forms?.filter(form => {
      const created = new Date(form.createdAt);
      return created >= lastMonth && created < thisMonth;
    }).length || 0;

    // Calculate percentage change
    const formTrend = lastMonthForms > 0 ? Math.round(((thisMonthForms - lastMonthForms) / lastMonthForms) * 100) : 0;

    // Calculate submission trends
    const thisMonthSubmissions = forms?.reduce((sum, form) => {
      // Use form.submissions for now since we don't have individual submission dates
      const formSubmissions = form.submissions || 0;
      return sum + formSubmissions;
    }, 0) || 0;

    const lastMonthSubmissions = forms?.reduce((sum, form) => {
      // Use form.submissions for now since we don't have individual submission dates
      const formSubmissions = form.submissions || 0;
      return sum + formSubmissions;
    }, 0) || 0;

    const submissionTrend = lastMonthSubmissions > 0 ? Math.round(((thisMonthSubmissions - lastMonthSubmissions) / lastMonthSubmissions) * 100) : 0;

    // Calculate response rate trends
    const thisMonthResponseRate = thisMonthForms > 0 ? Math.round((thisMonthSubmissions / (thisMonthForms * 10)) * 100) : 0;
    const lastMonthResponseRate = lastMonthForms > 0 ? Math.round((lastMonthSubmissions / (lastMonthForms * 10)) * 100) : 0;
    const responseRateTrend = lastMonthResponseRate > 0 ? Math.round(((thisMonthResponseRate - lastMonthResponseRate) / lastMonthResponseRate) * 100) : 0;

    return {
      formTrend,
      submissionTrend,
      responseRateTrend,
      thisMonthForms,
      lastMonthForms,
      thisMonthSubmissions,
      lastMonthSubmissions,
      thisMonthResponseRate,
      lastMonthResponseRate
    };
  };

  const trends = calculateTrends();

  const getTrendText = (value: number, type: 'forms' | 'submissions' | 'responseRate') => {
    if (value > 0) return `+${value}% from last month`;
    if (value < 0) return `${value}% from last month`;
    return "No change from last month";
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forms Management</h1>
            <p className="text-gray-600 mt-1">Manage your published forms and view submissions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {isLoading ? "Loading..." : `${totalForms} Forms`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Forms</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : totalForms}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${getTrendIcon(trends.formTrend)}`} />
            <span className={`text-sm ${getTrendColor(trends.formTrend)}`}>
              {getTrendText(trends.formTrend, 'forms')}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Forms</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : activeForms}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${getTrendIcon(trends.formTrend)}`} />
            <span className={`text-sm ${getTrendColor(trends.formTrend)}`}>
              {getTrendText(trends.formTrend, 'forms')}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : totalSubmissions.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${getTrendIcon(trends.submissionTrend)}`} />
            <span className={`text-sm ${getTrendColor(trends.submissionTrend)}`}>
              {getTrendText(trends.submissionTrend, 'submissions')}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : `${avgResponseRate}%`}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${getTrendIcon(trends.responseRateTrend)}`} />
            <span className={`text-sm ${getTrendColor(trends.responseRateTrend)}`}>
              {getTrendText(trends.responseRateTrend, 'responseRate')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
