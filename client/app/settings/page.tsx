"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  LogOut,
  Save,
  Settings as SettingsIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    username: user?.username || '',
    email: user?.email || '',
    notifications: true,
    darkMode: false,
    autoSave: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-deep-plum">Settings</h1>
          <p className="text-rich-mauve mt-2">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
            <CardTitle className="flex items-center gap-2 text-deep-plum">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-deep-plum">{user?.username}</h3>
                <p className="text-rich-mauve">{user?.email}</p>
                <Badge variant="outline" className="mt-1 border-green-200 text-green-700 bg-green-50">
                  Active Account
                </Badge>
              </div>
            </div>

            <Separator className="bg-warm-beige" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-deep-plum font-medium">Username</Label>
                <Input
                  id="username"
                  value={settings.username}
                  onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-deep-plum font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
            <CardTitle className="flex items-center gap-2 text-deep-plum">
              <SettingsIcon className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-rich-mauve" />
                  <div>
                    <p className="font-medium text-deep-plum">Notifications</p>
                    <p className="text-sm text-rich-mauve">Receive task reminders and updates</p>
                  </div>
                </div>
                <Button
                  variant={settings.notifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className={settings.notifications ? "bg-rich-mauve hover:bg-deep-plum" : "border-warm-beige"}
                >
                  {settings.notifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <Separator className="bg-warm-beige" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-rich-mauve" />
                  <div>
                    <p className="font-medium text-deep-plum">Dark Mode</p>
                    <p className="text-sm text-rich-mauve">Switch to dark theme</p>
                  </div>
                </div>
                <Button
                  variant={settings.darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                  className={settings.darkMode ? "bg-rich-mauve hover:bg-deep-plum" : "border-warm-beige"}
                >
                  {settings.darkMode ? 'Dark' : 'Light'}
                </Button>
              </div>

              <Separator className="bg-warm-beige" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-rich-mauve" />
                  <div>
                    <p className="font-medium text-deep-plum">Auto Save</p>
                    <p className="text-sm text-rich-mauve">Automatically save changes</p>
                  </div>
                </div>
                <Button
                  variant={settings.autoSave ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSettings(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                  className={settings.autoSave ? "bg-rich-mauve hover:bg-deep-plum" : "border-warm-beige"}
                >
                  {settings.autoSave ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cream-blush to-warm-beige border-b border-warm-beige">
            <CardTitle className="flex items-center gap-2 text-deep-plum">
              <Shield className="h-5 w-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-rich-mauve to-deep-plum hover:from-deep-plum hover:to-rich-mauve text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-white/95 backdrop-blur-sm border-warm-beige shadow-lg">
          <CardContent className="p-6">
            <div className="text-center text-sm text-rich-mauve">
              <p>Account created: {new Date().toLocaleDateString()}</p>
              <p className="mt-1">Last login: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}