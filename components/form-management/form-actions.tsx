"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Share2, 
  Download, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink,
  Eye,
  MoreHorizontal,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FormActionsProps {
  onShare?: () => void;
  onExport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopyLink?: () => void;
  onOpenForm?: () => void;
  onPreview?: () => void;
  onViewStats?: () => void;
  isMobile?: boolean;
}

export default function FormActions({
  onShare,
  onExport,
  onEdit,
  onDelete,
  onCopyLink,
  onOpenForm,
  onPreview,
  onViewStats,
  isMobile = false
}: FormActionsProps) {
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onOpenForm}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Form
          </Button>
          
          <Button
            variant="outline"
            onClick={onCopyLink}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-xs">Preview</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewStats}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <BarChart3 className="w-4 h-4 text-green-600" />
            <span className="text-xs">Stats</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Edit className="w-4 h-4 text-purple-600" />
            <span className="text-xs">Edit</span>
          </Button>
        </div>

        {/* Utility Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </Button>
        </div>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="text-sm">Delete Form</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={onShare} className="flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>
      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
        <Edit className="w-4 h-4 mr-2" />
        Edit Form
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview Form
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenForm}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Form
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onViewStats}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Stats
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Form
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 