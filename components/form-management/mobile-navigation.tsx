"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  FileText, 
  Users, 
  Settings,
  Home,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileNavigationProps {
  onSearch?: () => void;
  onFilter?: () => void;
  onCreateForm?: () => void;
  onViewStats?: () => void;
  onViewSettings?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function MobileNavigation({
  onSearch,
  onFilter,
  onCreateForm,
  onViewStats,
  onViewSettings,
  showBackButton = false,
  onBack
}: MobileNavigationProps) {
  const router = useRouter();

  const handleCreateForm = () => {
    if (onCreateForm) {
      onCreateForm();
    } else {
      router.push('/form-generator');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="md:hidden space-y-4">
      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Home className="w-5 h-5 text-blue-600" />
              <span className="text-xs">Home</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateForm}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Plus className="w-5 h-5 text-green-600" />
              <span className="text-xs">Create</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewStats}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-xs">Stats</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewSettings}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSearch}
              className="flex-1 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search forms</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back Navigation */}
      {showBackButton && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full flex items-center gap-2 text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">-</div>
              <div className="text-xs text-gray-500">Forms</div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">-</div>
              <div className="text-xs text-gray-500">Responses</div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">-</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 