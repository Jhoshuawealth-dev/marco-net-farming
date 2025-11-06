import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Image, TrendingUp, BookOpen, Calendar, DollarSign, Settings, FileText } from 'lucide-react';
import PostsManagement from '@/components/admin/PostsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import UsersManagementAdvanced from '@/components/admin/UsersManagementAdvanced';
import AdsManagement from '@/components/admin/AdsManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import CoursesManagement from '@/components/admin/CoursesManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import AuditLog from '@/components/admin/AuditLog';
import SystemSettings from '@/components/admin/SystemSettings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-primary rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/80">Manage your Marco-net Farming platform</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-2 bg-card border border-border">
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Ads</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2 data-[state=active]:bg-info data-[state=active]:text-white">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-warning data-[state=active]:text-background">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-muted data-[state=active]:text-foreground">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UsersManagementAdvanced />
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            <PostsManagement />
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <AdsManagement />
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <CoursesManagement />
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <EventsManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <AuditLog />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
