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
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Marco-net Farming platform</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 overflow-x-auto">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-2">
              <Image className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="ads" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Ads
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <FileText className="h-4 w-4" />
              Audit Log
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
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
