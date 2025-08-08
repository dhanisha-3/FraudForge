import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Globe,
  Mail,
  Phone,
  Lock,
  Eye,
  Save,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

// Import comprehensive settings components
import TechStack from "@/components/TechStack";
import DefenseMatrix from "@/components/DefenseMatrix";
// Removed non-existent component
import UnifiedAccountProtection from "@/components/UnifiedAccountProtection";
import DigitalIDManagement from "@/components/DigitalIDManagement";
import DecentralizedIdentityKYC from "@/components/DecentralizedIdentityKYC";
import SafeZonePortal from "@/components/SafeZonePortal";
import FraudEducationCenter from "@/components/FraudEducationCenter";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Profile Settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@fraudguard.ai',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',

    // Security Settings
    twoFactorEnabled: true,
    sessionTimeout: '30',
    passwordExpiry: '90',

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    fraudAlerts: true,
    systemUpdates: true,

    // AI Model Settings
    detectionSensitivity: 'high',
    autoBlockThreshold: '80',
    modelUpdateFrequency: 'daily',

    // System Settings
    dataRetention: '365',
    backupFrequency: 'daily',
    logLevel: 'info'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
          Settings & Configuration
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Configure your FraudGuard AI system preferences and security settings
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Security Settings</h3>
            <p className="text-muted-foreground">Configure authentication, access control, and security policies</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">AI Configuration</h3>
            <p className="text-muted-foreground">Customize AI model parameters and detection thresholds</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">System Management</h3>
            <p className="text-muted-foreground">Manage system resources, backups, and maintenance</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

/* --- TEMP: The following legacy Settings content was auto-commented to fix build. Will refactor into the component later. ---


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security preferences and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select value={settings.sessionTimeout} onValueChange={(value) => updateSetting('sessionTimeout', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Select value={settings.passwordExpiry} onValueChange={(value) => updateSetting('passwordExpiry', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive critical alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fraud Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Immediate alerts for detected fraud
                  </p>
                </div>
                <Switch
                  checked={settings.fraudAlerts}
                  onCheckedChange={(checked) => updateSetting('fraudAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about system updates and maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.systemUpdates}
                  onCheckedChange={(checked) => updateSetting('systemUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <span>AI Model Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure AI model behavior and detection parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Detection Sensitivity</Label>
                <Select value={settings.detectionSensitivity} onValueChange={(value) => updateSetting('detectionSensitivity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Fewer false positives</SelectItem>
                    <SelectItem value="medium">Medium - Balanced detection</SelectItem>
                    <SelectItem value="high">High - Maximum security</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Auto-Block Threshold (%)</Label>
                <Select value={settings.autoBlockThreshold} onValueChange={(value) => updateSetting('autoBlockThreshold', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="70">70% - Conservative</SelectItem>
                    <SelectItem value="80">80% - Balanced</SelectItem>
                    <SelectItem value="90">90% - Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Model Update Frequency</Label>
                <Select value={settings.modelUpdateFrequency} onValueChange={(value) => updateSetting('modelUpdateFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <span>System Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and data management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention Period (days)</Label>
                <Select value={settings.dataRetention} onValueChange={(value) => updateSetting('dataRetention', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting('backupFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select value={settings.logLevel} onValueChange={(value) => updateSetting('logLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error only</SelectItem>
                    <SelectItem value="warn">Warning and above</SelectItem>
                    <SelectItem value="info">Info and above</SelectItem>
                    <SelectItem value="debug">Debug (verbose)</SelectItem>
                  </SelectContent>
                </Select>

--- END TEMP COMMENT ---*/
