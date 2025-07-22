"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Save,
  Edit,
  Trash2,
  Download,
  Upload
} from "lucide-react"

interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  company?: string
  role?: string
}

interface UserSettings {
  profile: UserProfile
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    dateFormat: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    loginHistory: Array<{
      date: string
      location: string
      device: string
    }>
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app/api/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const userData = await response.json()
          
          const userSettings: UserSettings = {
            profile: {
              id: userData.id,
              email: userData.email,
              name: userData.name || userData.email.split('@')[0],
              phone: userData.phone || '',
              company: userData.company || '',
              role: userData.role || 'User'
            },
            preferences: {
              theme: "system",
              language: "en",
              timezone: "America/New_York",
              dateFormat: "MM/DD/YYYY",
              notifications: {
                email: true,
                push: true,
                sms: false
              }
            },
            security: {
              twoFactorEnabled: false,
              lastPasswordChange: new Date().toISOString(),
              loginHistory: [
                {
                  date: new Date().toISOString(),
                  location: "Current Session",
                  device: "Web Browser"
                }
              ]
            }
          }
          
          setSettings(userSettings)
          setEditedProfile(userSettings.profile)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const saveSettings = async () => {
    if (!editedProfile || !settings) return
    
    try {
      // In a real app, you'd save this to an API
      // For now, just update local state
      setSettings({
        ...settings,
        profile: editedProfile
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const updateNotificationSetting = (type: 'email' | 'push' | 'sms', value: boolean) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        notifications: {
          ...settings.preferences.notifications,
          [type]: value
        }
      }
    })
  }

  const toggleTwoFactor = () => {
    if (!settings) return
    
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        twoFactorEnabled: !settings.security.twoFactorEnabled
      }
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Failed to load user settings</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={settings.profile.name || settings.profile.email} />
              <AvatarFallback className="text-lg">
                {settings.profile.name ? settings.profile.name.split(' ').map(n => n[0]).join('') : settings.profile.email.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? (editedProfile?.name || '') : (settings.profile.name || '')}
                    onChange={(e) => isEditing && editedProfile && setEditedProfile({...editedProfile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    disabled={true} // Email usually shouldn't be editable
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={isEditing ? (editedProfile?.phone || '') : (settings.profile.phone || '')}
                    onChange={(e) => isEditing && editedProfile && setEditedProfile({...editedProfile, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={isEditing ? (editedProfile?.company || '') : (settings.profile.company || '')}
                    onChange={(e) => isEditing && editedProfile && setEditedProfile({...editedProfile, company: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Enter your company"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={isEditing ? (editedProfile?.role || '') : (settings.profile.role || '')}
                    onChange={(e) => isEditing && editedProfile && setEditedProfile({...editedProfile, role: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Enter your role"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={saveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance & Language
            </CardTitle>
            <CardDescription>
              Customize your interface preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={settings.preferences.theme} 
                onValueChange={(value: 'light' | 'dark' | 'system') => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, theme: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.preferences.language} 
                onValueChange={(value) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, language: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.preferences.timezone} 
                onValueChange={(value) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, timezone: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive updates via email
                </div>
              </div>
              <Switch
                checked={settings.preferences.notifications.email}
                onCheckedChange={(checked: boolean) => updateNotificationSetting('email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive browser notifications
                </div>
              </div>
              <Switch
                checked={settings.preferences.notifications.push}
                onCheckedChange={(checked: boolean) => updateNotificationSetting('push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive text message alerts
                </div>
              </div>
              <Switch
                checked={settings.preferences.notifications.sms}
                onCheckedChange={(checked: boolean) => updateNotificationSetting('sms', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <div className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </div>
              </div>
              <Switch
                checked={settings.security.twoFactorEnabled}
                onCheckedChange={toggleTwoFactor}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Last Password Change</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(settings.security.lastPasswordChange).toLocaleDateString()}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="font-medium">Recent Login Activity</div>
              <div className="space-y-2">
                {settings.security.loginHistory.map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium">{login.device}</div>
                        <div className="text-xs text-muted-foreground">
                          {login.location} • {new Date(login.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export your data or manage account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span>Import Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 text-red-600 hover:text-red-700">
              <Trash2 className="h-6 w-6" />
              <span>Delete Account</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 