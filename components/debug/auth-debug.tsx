"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuthDebug() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    checkSession();
    // Get cookies
    setCookies(document.cookie);
  }, []);

  const checkSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Auth Debug: Checking session...");
      const res = await authClient.getSession();
      console.log("📡 Auth Debug: Full response:", res);
      
      // Handle different response structures
      let userData = null;
      
      if (res && typeof res === 'object') {
        // Check if user is directly on the response
        if ('user' in res && res.user) {
          userData = res.user;
          console.log("✅ Auth Debug: User found directly on response:", userData);
        }
        // Check if user is in data property
        else if ('data' in res && res.data && typeof res.data === 'object') {
          if ('user' in res.data && res.data.user) {
            userData = res.data.user;
            console.log("✅ Auth Debug: User found in data property:", userData);
          }
          // Check if data itself is the user object
          else if (res.data && ('id' in res.data || 'email' in res.data)) {
            userData = res.data;
            console.log("✅ Auth Debug: Data is user object:", userData);
          }
        }
        // Check if response itself is the user object
        else if (res && ('id' in res || 'email' in res)) {
          userData = res;
          console.log("✅ Auth Debug: Response is user object:", userData);
        }
      }
      
      if (userData) {
        setSession({ user: userData });
      } else {
        console.log("❌ Auth Debug: No user found in response structure");
        setSession(null);
      }
    } catch (err) {
      console.error("🚨 Auth Debug: Error:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      setCookies(document.cookie);
      console.log("✅ Auth Debug: Signed out successfully");
    } catch (err) {
      console.error("❌ Auth Debug: Sign out error:", err);
    }
  };

  const handleSignIn = () => {
    window.location.href = "/sign-in";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            🔐 Auth Debug
            <Badge variant={session?.user ? "default" : "destructive"} className="text-xs">
              {session?.user ? "Signed In" : "Not Signed In"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-1">
            <div><strong>Loading:</strong> {loading ? "Yes" : "No"}</div>
            <div><strong>Error:</strong> {error || "None"}</div>
            <div><strong>Session:</strong> {session ? "Yes" : "No"}</div>
            <div><strong>User:</strong> {session?.user ? "Yes" : "No"}</div>
          </div>
          
          {session?.user && (
            <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
              <div><strong>Name:</strong> {session.user.name || "N/A"}</div>
              <div><strong>Email:</strong> {session.user.email || "N/A"}</div>
              <div><strong>ID:</strong> {session.user.id || "N/A"}</div>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" onClick={checkSession} className="text-xs">
              Refresh
            </Button>
            {session?.user ? (
              <Button size="sm" onClick={handleSignOut} variant="outline" className="text-xs">
                Sign Out
              </Button>
            ) : (
              <Button size="sm" onClick={handleSignIn} variant="outline" className="text-xs">
                Sign In
              </Button>
            )}
          </div>

          <details className="text-xs">
            <summary className="cursor-pointer">Cookies</summary>
            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto max-h-20">
              {cookies || "No cookies"}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
} 