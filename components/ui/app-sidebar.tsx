"use client";

import {
  FileText,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Plus,
  List,
  User,
  Mail,
  Calendar,
  Shield,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_SECTIONS = [
  {
    label: "DASHBOARD",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "FORMS",
    items: [
      {
        title: "Form Generator",
        url: "/form-generator",
        icon: FileText,
      },
      {
        title: "Form Management",
        url: "/form-management",
        icon: FileText,
      },
    ],
  },
  {
    label: "ATTENDANCE",
    items: [
      {
        title: "Attendance Management",
        url: "/attendance-management",
        icon: Users,
      },
    ],
  },
];

function useSessionUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    
    console.log("🔄 Sidebar: Starting session fetch...");
    
    authClient.getSession().then((res) => {
      console.log("📡 Sidebar: Auth response:", res);
      if (mounted) {
        // Handle different response structures
        let userData = null;
        
        if (res && typeof res === 'object') {
          // Check if user is directly on the response
          if ('user' in res && res.user) {
            userData = res.user;
            console.log("✅ Sidebar: User found directly on response:", userData);
          }
          // Check if user is in data property
          else if ('data' in res && res.data && typeof res.data === 'object') {
            if ('user' in res.data && res.data.user) {
              userData = res.data.user;
              console.log("✅ Sidebar: User found in data property:", userData);
            }
            // Check if data itself is the user object
            else if (res.data && ('id' in res.data || 'email' in res.data)) {
              userData = res.data;
              console.log("✅ Sidebar: Data is user object:", userData);
            }
          }
          // Check if response itself is the user object
          else if (res && ('id' in res || 'email' in res)) {
            userData = res;
            console.log("✅ Sidebar: Response is user object:", userData);
          }
        }
        
        if (userData) {
          setUser(userData);
        } else {
          console.log("❌ Sidebar: No user found in response structure");
          setUser(null);
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.error("🚨 Sidebar: Auth error:", err);
      if (mounted) {
        setUser(null);
        setError(err.message || 'Failed to load user data');
        setLoading(false);
      }
    });
    
    return () => { mounted = false; };
  }, []);
  
  return { user, loading, error };
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, error } = useSessionUser();

  // Sign out handler
  const handleSignOut = async () => {
    console.log("🚪 Sidebar: Signing out...");
    await authClient.signOut();
    router.push("/sign-in");
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get user status
  const getUserStatus = () => {
    if (!user) return 'offline';
    // You can add logic here to determine if user is online/offline
    return 'online';
  };

  // Check if current path is forms-related
  const isFormsActive = pathname === "/form-generator" || pathname === "/form-management" || pathname.startsWith("/form-management/");

  console.log("🎯 Sidebar: Current state - user:", user, "loading:", loading, "error:", error);

  return (
    <>
      {/* Fixed Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col bg-white border-r border-gray-200 h-screen z-40">
        {/* Logo/Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <Image src="/images/logo.svg" width={32} height={32} alt="NEBIB Logo" className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">NEBIB</h2>
            <p className="text-xs text-gray-500 font-medium">Form Builder</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-6">
              <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.label}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-700")} />
                        <span>{item.title}</span>
                        {isActive && <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        
        {/* User Info & Actions */}
        <div className="mt-auto px-6 py-4 border-t border-gray-100 bg-white">
          {loading ? (
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <User className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Authentication Error</p>
                <p className="text-xs text-red-700">{error}</p>
                <button 
                  onClick={() => router.push("/sign-in")}
                  className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                >
                  Sign in again
                </button>
              </div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                        {getUserInitials(user.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                      getUserStatus() === 'online' ? "bg-green-500" : "bg-gray-400"
                    )}></div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || 'user@email.com'}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getUserStatus()}
                  </Badge>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email || 'user@email.com'}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Not signed in</p>
                <p className="text-xs text-gray-500">Please sign in to continue</p>
                <button 
                  onClick={() => router.push("/sign-in")}
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-white border-t border-gray-200 shadow-lg justify-around py-2 w-full">
        {[
          { url: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { 
            url: "#", 
            icon: FileText, 
            label: "Forms",
            isDropdown: true,
            dropdownItems: [
              { url: "/form-generator", icon: Plus, label: "Create Form" },
              { url: "/form-management", icon: List, label: "Manage Forms" },
            ]
          },
          { url: "/attendance-management", icon: Users, label: "Attendance" },
          { url: "/settings", icon: Settings, label: "Settings" },
        ].map((item) => {
          const isActive = pathname === item.url || (item.isDropdown && isFormsActive);
          
          if (item.isDropdown) {
            return (
              <DropdownMenu key={item.url}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex flex-col items-center justify-center flex-1 gap-1 px-1 py-1 rounded-lg transition-all duration-200",
                      isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
                    )}
                  >
                    <item.icon className="w-6 h-6 mb-0.5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side="top" className="w-48">
                  {item.dropdownItems?.map((dropdownItem) => (
                    <DropdownMenuItem
                      key={dropdownItem.url}
                      onClick={() => router.push(dropdownItem.url)}
                      className="flex items-center gap-3"
                    >
                      <dropdownItem.icon className="w-4 h-4" />
                      <span>{dropdownItem.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <button
              key={item.url}
              onClick={() => router.push(item.url)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-1 px-1 py-1 rounded-lg transition-all duration-200",
                isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="w-6 h-6 mb-0.5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
