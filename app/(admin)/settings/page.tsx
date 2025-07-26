"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Bell, 
  Settings, 
  LogOut, 
  Edit, 
  Camera,
  Globe,
  Key,
  Activity,
  FileText,
  Users,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    activeForms: 0,
    lastLogin: new Date().toLocaleDateString()
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log("🔄 Settings: Starting session fetch...");
    
    authClient.getSession().then((res) => {
      console.log("📡 Settings: Auth response:", res);
      
      // Handle different response structures
      let userData = null;
      
      if (res && typeof res === 'object') {
        // Check if user is directly on the response
        if ('user' in res && res.user) {
          userData = res.user;
          console.log("✅ Settings: User found directly on response:", userData);
        }
        // Check if user is in data property
        else if ('data' in res && res.data && typeof res.data === 'object') {
          if ('user' in res.data && res.data.user) {
            userData = res.data.user;
            console.log("✅ Settings: User found in data property:", userData);
          }
          // Check if data itself is the user object
          else if (res.data && ('id' in res.data || 'email' in res.data)) {
            userData = res.data;
            console.log("✅ Settings: Data is user object:", userData);
          }
        }
        // Check if response itself is the user object
        else if (res && ('id' in res || 'email' in res)) {
          userData = res;
          console.log("✅ Settings: Response is user object:", userData);
        }
      }
      
      if (userData) {
        setUser(userData);
      } else {
        console.log("❌ Settings: No user found in response structure");
        setUser(null);
      }
      setLoading(false);
    }).catch((err) => {
      console.error("🚨 Settings: Auth error:", err);
      setUser(null);
      setError(err.message || 'Failed to load user data');
      setLoading(false);
    });

    // Fetch user stats (mock data for now)
    setStats({
      totalForms: 12,
      totalSubmissions: 156,
      activeForms: 8,
      lastLogin: new Date().toLocaleDateString()
    });
  }, []);

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSignOut = async () => {
    console.log("🚪 Settings: Signing out...");
    await authClient.signOut();
    toast.success("Signed out successfully");
    window.location.href = "/sign-in";
  };

  console.log("🎯 Settings: Current state - user:", user, "loading:", loading, "error:", error);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.href = "/sign-in"}>
              Sign In Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Signed In</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your settings</p>
            <Button onClick={() => window.location.href = "/sign-in"}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 pb-20 md:pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and profile picture</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold">
                      {getUserInitials(user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" variant="outline" className="absolute -bottom-1 -right-1 h-8 w-8 p-0 rounded-full">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <Input 
                        type="text" 
                        defaultValue={user?.name || "User"} 
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <Input 
                        type="email" 
                        defaultValue={user?.email || "user@email.com"} 
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <Input 
                        type="text" 
                        defaultValue={user?.email?.split('@')[0] || "user"} 
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Account Statistics
              </CardTitle>
              <CardDescription>Overview of your form building activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.totalForms}</div>
                  <div className="text-sm text-gray-600">Total Forms</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</div>
                  <div className="text-sm text-gray-600">Submissions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.activeForms}</div>
                  <div className="text-sm text-gray-600">Active Forms</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.lastLogin}</div>
                  <div className="text-sm text-gray-600">Last Login</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Password</div>
                    <div className="text-sm text-gray-600">Last changed 30 days ago</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-600">Add an extra layer of security</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Bell className="w-4 h-4" />
                Notification Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Globe className="w-4 h-4" />
                Language & Region
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Activity className="w-4 h-4" />
                Activity Log
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">{new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Last login</span>
                <span className="font-medium">{stats.lastLogin}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Status</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-0 shadow-lg border-red-100">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 