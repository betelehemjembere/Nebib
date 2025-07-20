"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "./sidebar";
import { Button } from "./button";
import { Badge } from "./badge";

export default function TopPart() {
  return (
    <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors" />
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search forms, users, or settings..."
            className="pl-10 pr-4 h-10 w-80 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          />
        </div>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              3
            </Badge>
          </Button>
        </div>
        {/* Help */}
        <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
