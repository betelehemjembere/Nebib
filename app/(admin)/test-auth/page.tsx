"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuthPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Test Auth: Checking session...");
      const res = await authClient.getSession();
      console.log("📡 Test Auth: Full response:", res);
      
      // Handle different response structures
      let userData = null;
      
      if (res && typeof res === 'object') {
        // Check if user is directly on the response
        if ('user' in res && res.user) {
          userData = res.user;
          console.log("✅ Test Auth: User found directly on response:", userData);
        }
        // Check if user is in data property
        else if ('data' in res && res.data && typeof res.data === 'object') {
          if ('user' in res.data && res.data.user) {
            userData = res.data.user;
            console.log("✅ Test Auth: User found in data property:", userData);
          }
          // Check if data itself is the user object
          else if (res.data && ('id' in res.data || 'email' in res.data)) {
            userData = res.data;
            console.log("✅ Test Auth: Data is user object:", userData);
          }
        }
        // Check if response itself is the user object
        else if (res && ('id' in res || 'email' in res)) {
          userData = res;
          console.log("✅ Test Auth: Response is user object:", userData);
        }
      }
      
      if (userData) {
        setSession({ user: userData });
      } else {
        console.log("❌ Test Auth: No user found in response structure");
        setSession(null);
      }
    } catch (err) {
      console.error("🚨 Test Auth: Error:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      console.log("✅ Test Auth: Signed out successfully");
    } catch (err) {
      console.error("❌ Test Auth: Sign out error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Loading:</strong> {loading ? "Yes" : "No"}
              </div>
              <div>
                <strong>Error:</strong> {error || "None"}
              </div>
              <div>
                <strong>Session exists:</strong> {session ? "Yes" : "No"}
              </div>
              <div>
                <strong>User exists:</strong> {session?.user ? "Yes" : "No"}
              </div>
            </div>
          </CardContent>
        </Card>

        {session && (
          <Card>
            <CardHeader>
              <CardTitle>Session Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {session?.user && (
          <Card>
            <CardHeader>
              <CardTitle>User Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Name:</strong> {session.user.name || "Not set"}</div>
                <div><strong>Email:</strong> {session.user.email || "Not set"}</div>
                <div><strong>ID:</strong> {session.user.id || "Not set"}</div>
                <div><strong>Image:</strong> {session.user.image || "Not set"}</div>
                <div><strong>Organization:</strong> {session.user.organizationName || "Not set"}</div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={checkSession}>
            Refresh Session
          </Button>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
          <Button onClick={() => window.location.href = "/sign-in"} variant="outline">
            Go to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
} 