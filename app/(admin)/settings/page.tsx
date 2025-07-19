"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    authClient.getSession().then((res) => {
      if (res && 'user' in res) {
        setUser(res.user || null);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Settings</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden ring-2 ring-white shadow-sm">
              <Image src={user?.image || "/man.jpg"} alt="User avatar" width={64} height={64} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-lg text-gray-900">{user?.name || "User"}</div>
              <div className="text-gray-500 text-sm">{user?.email || "-"}</div>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input type="text" defaultValue={user?.name || ""} disabled className="bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input type="email" defaultValue={user?.email || ""} disabled className="bg-gray-100" />
            </div>
            <Button type="button" disabled>Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Notification settings coming soon.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and account security</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Security settings coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
} 