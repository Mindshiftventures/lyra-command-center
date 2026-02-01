'use client';

import { useState, useEffect } from 'react';

// Types
interface Activity {
  id: string;
  timestamp: string;
  action: string;
  reasoning: string;
  source?: string;
}

interface SubAgent {
  id: string;
  label: string;
  status: 'running' | 'completed' | 'pending';
  task: string;
  startedAt: string;
}

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused';
}

interface OperatingDoc {
  name: string;
  path: string;
  description: string;
  lastModified?: string;
}

interface Decision {
  id: string;
  timestamp: string;
  decision: string;
  trigger: string;
  file: string;
  rule?: string;
}

// Mock data - will be replaced with live API later
const mockStatus = {
  state: 'Active',
  lastActivity: new Date().toISOString(),
  uptime: '3d 14h 22m',
  model: 'claude-sonnet-4-20250514',
  channel: 'telegram',
};

const mockActivities: Activity[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    action: 'Sent morning briefing to Birju',
    reasoning: 'Scheduled task triggered at 9:00 AM per cron configuration',
    source: 'cron:morning-briefing',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    action: 'Checked email inbox',
    reasoning: 'HEARTBEAT.md includes email check - no urgent emails found',
    source: 'heartbeat',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    action: 'Updated memory/2025-02-07.md',
    reasoning: 'Logged conversation context from previous session',
    source: 'session-end',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    action: 'Spawned subagent for code review',
    reasoning: 'Complex task requiring isolated context - delegated per AGENTS.md guidelines',
    source: 'user-request',
  },
];

const mockSubAgents: SubAgent[] = [
  {
    id: 'sa-001',
    label: 'lyra-command-center-build',
    status: 'running',
    task: 'Building Lyra Command Center dashboard',
    startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

const mockScheduledTasks: ScheduledTask[] = [
  {
    id: 'cron-1',
    name: 'Morning Briefing',
    schedule: '0 9 * * 1-5',
    nextRun: 'Tomorrow 9:00 AM',
    lastRun: 'Today 9:00 AM',
    status: 'active',
  },
  {
    id: 'cron-2',
    name: 'Evening Shutdown',
    schedule: '0 22 * * *',
    nextRun: 'Today 10:00 PM',
    lastRun: 'Yesterday 10:00 PM',
    status: 'active',
  },
  {
    id: 'cron-3',
    name: 'Weekly Review',
    schedule: '0 18 * * 0',
    nextRun: 'Sunday 6:00 PM',
    lastRun: 'Last Sunday 6:00 PM',
    status: 'active',
  },
  {
    id: 'heartbeat-1',
    name: 'Heartbeat Poll',
    schedule: 'Every 30 min',
    nextRun: 'In 12 minutes',
    lastRun: '18 minutes ago',
    status: 'active',
  },
];

const mockOperatingDocs: OperatingDoc[] = [
  { name: 'SOUL.md', path: '~/clawd/SOUL.md', description: 'Core identity and personality' },
  { name: 'AGENTS.md', path: '~/clawd/AGENTS.md', description: 'Workspace rules and behavior' },
  { name: 'MEMORY.md', path: '~/clawd/MEMORY.md', description: 'Long-term curated memories' },
  { name: 'USER.md', path: '~/clawd/USER.md', description: 'Information about Birju' },
  { name: 'TOOLS.md', path: '~/clawd/TOOLS.md', description: 'Tool-specific configurations' },
  { name: 'HEARTBEAT.md', path: '~/clawd/HEARTBEAT.md', description: 'Periodic task checklist' },
];

const mockDecisions: Decision[] = [
  {
    id: 'd-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    decision: 'Used feature branch workflow instead of direct main commit',
    trigger: 'Code change detected',
    file: 'TOOLS.md',
    rule: 'Development Workflow: Create feature branch — never commit directly to main',
  },
  {
    id: 'd-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    decision: 'Replied HEARTBEAT_OK without action',
    trigger: 'Heartbeat poll received',
    file: 'AGENTS.md',
    rule: 'Late night (23:00-08:00) unless urgent → stay quiet',
  },
  {
    id: 'd-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    decision: 'Spawned subagent instead of handling inline',
    trigger: 'Complex overnight task assigned',
    file: 'AGENTS.md',
    rule: 'If a task is more complex or takes longer, spawn a sub-agent',
  },
];

// Components
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-background rounded-lg p-5 shadow-card ${className}`}>
      {children}
    </div>
  );
}

function Badge({ status }: { status: 'running' | 'completed' | 'pending' | 'active' | 'paused' }) {
  const colors = {
    running: 'bg-success/10 text-success',
    completed: 'bg-muted/10 text-muted',
    pending: 'bg-warning/10 text-warning',
    active: 'bg-success/10 text-success',
    paused: 'bg-muted/10 text-muted',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-tiny ${colors[status]}`}>
      {status}
    </span>
  );
}

function StatusIndicator({ state }: { state: string }) {
  const isActive = state === 'Active';
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-success' : 'bg-muted'}`} />
      <span className="text-small font-medium">{state}</span>
    </div>
  );
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTimeShort(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

// Main Dashboard
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen p-5 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl text-foreground">Lyra Command Center</h1>
          <span className="text-small text-muted">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {' · '}
            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-small text-muted">Transparency dashboard for understanding how Lyra operates</p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Column 1 */}
        <div className="space-y-5">
          {/* Status Panel */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Status</h2>
              <StatusIndicator state={mockStatus.state} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-small text-muted">Last Activity</span>
                <span className="text-small">{formatTime(mockStatus.lastActivity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-small text-muted">Uptime</span>
                <span className="text-small">{mockStatus.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-small text-muted">Model</span>
                <span className="text-small font-medium">{mockStatus.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-small text-muted">Channel</span>
                <span className="text-small">{mockStatus.channel}</span>
              </div>
            </div>
          </Card>

          {/* Active Sub-Agents */}
          <Card>
            <h2 className="text-lg mb-4">Active Sub-Agents</h2>
            {mockSubAgents.length === 0 ? (
              <p className="text-small text-muted">No active sub-agents</p>
            ) : (
              <div className="space-y-4">
                {mockSubAgents.map((agent) => (
                  <div key={agent.id} className="border-l-2 border-primary pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-small font-medium">{agent.label}</span>
                      <Badge status={agent.status} />
                    </div>
                    <p className="text-small text-muted">{agent.task}</p>
                    <p className="text-tiny text-muted mt-1">Started {formatTime(agent.startedAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Operating Docs */}
          <Card>
            <h2 className="text-lg mb-4">Operating Docs</h2>
            <div className="space-y-3">
              {mockOperatingDocs.map((doc) => (
                <div key={doc.name} className="group">
                  <div className="flex items-center gap-2">
                    <span className="text-small font-medium text-primary">{doc.name}</span>
                  </div>
                  <p className="text-tiny text-muted">{doc.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-5">
          {/* Recent Activity Log */}
          <Card className="lg:row-span-2">
            <h2 className="text-lg mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-small font-medium">{activity.action}</p>
                    <span className="text-tiny text-muted whitespace-nowrap">{formatTimeShort(activity.timestamp)}</span>
                  </div>
                  <p className="text-tiny text-muted mb-2">{activity.reasoning}</p>
                  {activity.source && (
                    <span className="inline-block px-2 py-0.5 bg-surface rounded text-tiny text-muted">
                      {activity.source}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Column 3 */}
        <div className="space-y-5">
          {/* Scheduled Tasks */}
          <Card>
            <h2 className="text-lg mb-4">Scheduled Tasks</h2>
            <div className="space-y-3">
              {mockScheduledTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-small font-medium">{task.name}</span>
                      <Badge status={task.status} />
                    </div>
                    <p className="text-tiny text-muted">Next: {task.nextRun}</p>
                  </div>
                  <span className="text-tiny text-muted bg-surface px-2 py-0.5 rounded whitespace-nowrap">
                    {task.schedule}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Decision Trace */}
          <Card>
            <h2 className="text-lg mb-4">Decision Trace</h2>
            <div className="space-y-4">
              {mockDecisions.map((decision) => (
                <div key={decision.id} className="border-l-2 border-surface pl-3">
                  <p className="text-small font-medium mb-1">{decision.decision}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-tiny text-muted">Trigger:</span>
                    <span className="text-tiny">{decision.trigger}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-tiny text-primary">{decision.file}</span>
                    <span className="text-tiny text-muted">·</span>
                    <span className="text-tiny text-muted">{formatTime(decision.timestamp)}</span>
                  </div>
                  {decision.rule && (
                    <p className="text-tiny text-muted mt-2 italic bg-surface p-2 rounded">
                      "{decision.rule}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-5 border-t border-border">
        <p className="text-tiny text-muted text-center">
          Lyra Command Center · Built for transparency · Data refreshes on page load
        </p>
      </footer>
    </div>
  );
}
