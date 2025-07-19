"use client";

import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle, 
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  tabs: string[];
  currentTab: number;
  onTabChange: (tab: number) => void;
}

export default function TabNavigation({
  tabs,
  currentTab,
  onTabChange,
}: TabNavigationProps) {
  const getTabIcon = (tab: string) => {
    switch (tab.toLowerCase()) {
      case 'students':
        return <Users className="w-4 h-4" />;
      case 'check-in':
        return <CheckCircle className="w-4 h-4" />;
      case 'review':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab.toLowerCase()) {
      case 'students':
        return 'Students';
      case 'check-in':
        return 'Check-In';
      case 'review':
        return 'Review';
      default:
        return tab;
    }
  };

  const getTabDescription = (tab: string) => {
    switch (tab.toLowerCase()) {
      case 'students':
        return "View and manage student registrations";
      case 'check-in':
        return "Mark attendance for today's session";
      case 'review':
        return "Review attendance analytics and reports";
      default:
        return "";
    }
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Management</h2>
          <span className="text-sm text-gray-500">
            {tabs.length} sections available
          </span>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex items-center space-x-2">
          {tabs.map((tab, index) => {
            const isActive = currentTab === index;

            return (
              <Button
                key={tab}
                variant="ghost"
                className={cn(
                  "flex-1 h-16 flex flex-col items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out relative group",
                  isActive && "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md",
                  !isActive && "hover:bg-gray-50 border-2 border-transparent"
                )}
                onClick={() => onTabChange(index)}
              >
                {/* Tab Icon */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive && "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
                  !isActive && "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                )}>
                  {getTabIcon(tab)}
                </div>

                {/* Tab Label */}
                <span className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isActive && "text-blue-700 font-semibold",
                  !isActive && "text-gray-600 group-hover:text-gray-800"
                )}>
                  {getTabLabel(tab)}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Section Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {getTabDescription(tabs[currentTab])}
        </p>
      </div>
    </div>
  );
} 