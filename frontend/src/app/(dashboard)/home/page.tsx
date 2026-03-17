import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";
import { ArrowUpRight, Activity, Database, Zap, MessageSquare, Users, Brain, TrendingUp } from "lucide-react";

const stats = [
  { 
    label: "Total Queries", 
    value: "12,480", 
    change: "+23%",
    icon: MessageSquare
  },
  { 
    label: "Active Users", 
    value: "1,024", 
    change: "+12%",
    icon: Users
  },
  { 
    label: "Knowledge Base", 
    value: "2.1M", 
    change: "+8%",
    icon: Database
  },
  { 
    label: "System Health", 
    value: "99.9%", 
    change: "Optimal",
    icon: Activity
  },
];

const features = [
  {
    title: "Chat with Your Knowledge",
    description: "Ask questions about any document, conversation, or organizational knowledge instantly.",
    icon: "💬",
  },
  {
    title: "Voice Assistant",
    description: "Hands-free AI interaction with natural language processing and real-time transcription.",
    icon: "🎤",
  },
  {
    title: "Meeting Intelligence",
    description: "Automatic transcription, summaries, and action item extraction from all your meetings.",
    icon: "📞",
  },
  {
    title: "Video Analysis",
    description: "Search and analyze video content with AI-powered transcription and chapter markers.",
    icon: "🎬",
  },
  {
    title: "Smart Search",
    description: "Unified search across all knowledge sources with semantic understanding.",
    icon: "🔍",
  },
  {
    title: "Workflows & Automation",
    description: "Create intelligent workflows to automate repetitive tasks and knowledge management.",
    icon: "⚙️",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to KnowledgeForge"
        description="Your enterprise AI knowledge partner. Chat, search, and collaborate with organization-wide intelligence."
      />

      {/* Key Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardDescription className="text-xs font-medium">{stat.label}</CardDescription>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Core Capabilities</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Start Conversation */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">Start a Conversation</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Chat with your knowledge base using natural language
                </CardDescription>
              </div>
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Open Chat →
            </button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
            <CardDescription className="text-xs mt-1">All systems operational</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "API Server", status: "online" },
              { name: "Database", status: "online" },
              { name: "Search Index", status: "online" },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{service.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Latest Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "SharePoint Documents Synced",
                  time: "2 minutes ago",
                  icon: "✓",
                  color: "text-green-600"
                },
                {
                  title: "Voice Assistant Processing 2.3K Requests",
                  time: "5 minutes ago",
                  icon: "🎤",
                  color: "text-blue-600"
                },
                {
                  title: "Meeting Transcription Completed",
                  time: "12 minutes ago",
                  icon: "📝",
                  color: "text-purple-600"
                },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b last:pb-0 last:border-0">
                  <span className={`text-lg ${activity.color}`}>{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
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
