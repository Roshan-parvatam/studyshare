import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, ClipboardList, Bell, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats, useDashboardActivity } from '@/hooks/useDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats } = useDashboardStats();
  const { data: activity } = useDashboardActivity();

  const statCards = [
    { label: 'Classes Today', value: String(stats?.todayTimetable?.length ?? 0), icon: Calendar, color: 'text-primary' },
    { label: 'Notes', value: String(stats?.notes?.total ?? 0), icon: FileText, color: 'text-secondary-foreground' },
    { label: 'Assignments Pending', value: String(stats?.assignments?.pending ?? 0), icon: ClipboardList, color: 'text-accent' },
    { label: 'Upcoming Reminders', value: String(stats?.upcomingReminders ?? 0), icon: Bell, color: 'text-primary' },
  ];

  const quickActions = [
    { title: 'View Timetable', description: 'Check your class schedule', icon: Calendar, path: '/timetable' },
    { title: 'Upload Notes', description: 'Share study materials', icon: FileText, path: '/notes' },
    { title: 'Track Assignments', description: 'Manage your deadlines', icon: ClipboardList, path: '/assignments' },
    { title: 'Group Projects', description: 'Collaborate with peers', icon: Users, path: '/projects' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Here's your academic overview for today</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-glow transition-all hover:-translate-y-1"
                  onClick={() => navigate(action.path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-primary rounded-lg">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{action.title}</CardTitle>
                        <CardDescription className="text-xs">{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(activity ?? []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                  <span className="text-xs uppercase text-muted-foreground">{item.type}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title ?? item.type}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}