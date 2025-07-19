"use client";

import Students from "@/components/attendance-management/students";
import TabNavigation from "@/components/attendance-management/tab-navigation";
import { useState } from "react";
import { useGetStudents } from "../_hooks/student_hooks";
import { useParams } from "next/navigation";
import Statistics from "@/components/attendance-management/statistics";
import CheckIn from "@/components/attendance-management/check-in";
import Review from "@/components/attendance-management/review";

export default function AttendanceManagementPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = ["students", "check-in", "review"];
  const { formId } = useParams();
  const { data } = useGetStudents(formId as string);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Not Found</h3>
          <p className="text-gray-600">The requested attendance data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-gray-600 mt-1">Manage attendance for {data.topic}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Form ID:</span>
                <span className="text-sm text-gray-500 ml-2 font-mono">{formId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <TabNavigation
            tabs={tabs}
            currentTab={currentTab}
            onTabChange={(tab) => setCurrentTab(tab)}
          />
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            {currentTab === 0 && data && <Students data={data} />}
            {currentTab === 1 && <CheckIn data={data} />}
            {currentTab === 2 && <Review data={data} />}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Attendance Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
