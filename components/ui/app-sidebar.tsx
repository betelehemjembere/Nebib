"use client";

import {
  FileText,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    let mounted = true;
    authClient.getSession().then((res) => {
      if (mounted && res && 'user' in res) {
        setUser(res.user || null);
      }
    });
    return () => { mounted = false; };
  }, []);
  return user;
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSessionUser();

  // Sign out handler
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  // Fallback user info
  const displayUser = user || { name: "User", email: "user@email.com", image: "/man.jpg" };

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
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden ring-2 ring-white shadow-sm">
              <Image src={displayUser.image} alt="User avatar" width={40} height={40} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{displayUser.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              onClick={() => router.push("/settings")}
            >
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Settings</span>
            </button>
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-white border-t border-gray-200 shadow-lg justify-around py-2 w-full">
        {[
          { url: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { url: "/form-generator", icon: FileText, label: "Forms" },
          { url: "/attendance-management", icon: Users, label: "Attendance" },
          { url: "/settings", icon: Settings, label: "Settings" },
        ].map((item) => {
          const isActive = pathname === item.url;
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
