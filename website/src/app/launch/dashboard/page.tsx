'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LaunchMetrics {
  emailSignups: number;
  huntersRecruited: number;
  upvotes: number;
  comments: number;
  websiteClicks: number;
  conversions: number;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  replied: boolean;
}

interface Task {
  id: string;
  task: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  dueTime: string;
}

export default function LaunchDashboard() {
  const launchDate = new Date('2026-03-25T00:01:00-07:00');
  const [isLaunched, setIsLaunched] = useState(false);
  const [timeUntilLaunch, setTimeUntilLaunch] = useState('');

  // Metrics state
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    emailSignups: 0,
    huntersRecruited: 0,
    upvotes: 0,
    comments: 0,
    websiteClicks: 0,
    conversions: 0,
  });

  // Comments needing reply
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);

  // Launch day tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', task: 'Post ProductHunt launch announcement on Instagram Stories', status: 'pending', assignee: 'Michael', dueTime: '12:05 AM PT' },
    { id: '2', task: 'Tweet launch announcement with ProductHunt link', status: 'pending', assignee: 'Michael', dueTime: '12:05 AM PT' },
    { id: '3', task: 'Email launch list with ProductHunt link + LAUNCH50 code', status: 'pending', assignee: 'Auto', dueTime: '12:10 AM PT' },
    { id: '4', task: 'Post in r/Entrepreneur, r/SideProject, r/startups', status: 'pending', assignee: 'Michael', dueTime: '8:00 AM PT' },
    { id: '5', task: 'Monitor and reply to ALL comments within 30 minutes', status: 'pending', assignee: 'Michael', dueTime: 'Continuous' },
    { id: '6', task: 'Post thank-you story on Instagram with hunter shoutouts', status: 'pending', assignee: 'Michael', dueTime: '6:00 PM PT' },
    { id: '7', task: 'Email hunters with final results + thank you', status: 'pending', assignee: 'Michael', dueTime: '11:00 PM PT' },
  ]);

  // Calculate time until launch
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = launchDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilLaunch(`${days}d ${hours}h ${minutes}m`);
        setIsLaunched(false);
      } else {
        setTimeUntilLaunch('LIVE NOW');
        setIsLaunched(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Load metrics from API (placeholder - would connect to real API)
  useEffect(() => {
    // TODO: Fetch real metrics from API
    // For now, load from localStorage for demo
    const stored = localStorage.getItem('launch_metrics');
    if (stored) {
      setMetrics(JSON.parse(stored));
    }

    // Simulate metric updates during launch (for demo)
    if (isLaunched) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          upvotes: prev.upvotes + Math.floor(Math.random() * 3),
          comments: prev.comments + Math.floor(Math.random() * 2),
          websiteClicks: prev.websiteClicks + Math.floor(Math.random() * 5),
        }));
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLaunched]);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('launch_tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  const updateTaskStatus = (id: string, status: Task['status']) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, status } : task
    );
    setTasks(updated);
    localStorage.setItem('launch_tasks', JSON.stringify(updated));
  };

  const updateMetric = (key: keyof LaunchMetrics, value: number) => {
    const updated = { ...metrics, [key]: value };
    setMetrics(updated);
    localStorage.setItem('launch_metrics', JSON.stringify(updated));
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Launch Dashboard
            </h1>
            <div className={`px-4 py-2 rounded-full ${isLaunched ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-gold/10 border border-gold/20 text-gold'}`}>
              {timeUntilLaunch}
            </div>
          </div>
          <p className="text-text-secondary">
            Real-time tracking for ProductHunt launch on Tuesday, March 25, 2026
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <div className="rounded-xl bg-bg-card border border-white/[0.06] p-6">
            <div className="text-text-secondary text-sm mb-2">Email Signups</div>
            <div className="text-3xl font-semibold text-gradient mb-2">{metrics.emailSignups}</div>
            <input
              type="number"
              value={metrics.emailSignups}
              onChange={(e) => updateMetric('emailSignups', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 rounded bg-bg-elevated border border-white/[0.06] text-xs text-text-secondary"
              placeholder="Update..."
            />
          </div>

          <div className="rounded-xl bg-bg-card border border-white/[0.06] p-6">
            <div className="text-text-secondary text-sm mb-2">Hunters</div>
            <div className="text-3xl font-semibold text-gradient mb-2">{metrics.huntersRecruited}</div>
            <input
              type="number"
              value={metrics.huntersRecruited}
              onChange={(e) => updateMetric('huntersRecruited', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 rounded bg-bg-elevated border border-white/[0.06] text-xs text-text-secondary"
              placeholder="Update..."
            />
          </div>

          <div className="rounded-xl bg-bg-card border border-white/[0.06] p-6">
            <div className="text-text-secondary text-sm mb-2">Upvotes</div>
            <div className="text-3xl font-semibold text-gradient mb-2">{metrics.upvotes}</div>
            <input
              type="number"
              value={metrics.upvotes}
              onChange={(e) => updateMetric('upvotes', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 rounded bg-bg-elevated border border-white/[0.06] text-xs text-text-secondary"
              placeholder="Update..."
            />
          </div>

          <div className="rounded-xl bg-bg-card border border-white/[0.06] p-6">
            <div className="text-text-secondary text-sm mb-2">Comments</div>
            <div className="text-3xl font-semibold text-gradient mb-2">{metrics.comments}</div>
            <input
              type="number"
              value={metrics.comments}
              onChange={(e) => updateMetric('comments', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 rounded bg-bg-elevated border border-white/[0.06] text-xs text-text-secondary"
              placeholder="Update..."
            />
          </div>

          <div className="rounded-xl bg-bg-card border border-white/[0.06] p-6">
            <div className="text-text-secondary text-sm mb-2">Website Clicks</div>
            <div className="text-3xl font-semibold text-gradient mb-2">{metrics.websiteClicks}</div>
            <input
              type="number"
              value={metrics.websiteClicks}
              onChange={(e) => updateMetric('websiteClicks', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 rounded bg-bg-elevated border border-white/[0.06] text-xs text-text-secondary"
              placeholder="Update..."
            />
          </div>

          <div className="rounded-xl bg-bg-card border border-white/[0.06] p-6">
            <div className="text-text-secondary text-sm mb-2">Conversions</div>
            <div className="text-3xl font-semibold text-gradient mb-2">{metrics.conversions}</div>
            <input
              type="number"
              value={metrics.conversions}
              onChange={(e) => updateMetric('conversions', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 rounded bg-bg-elevated border border-white/[0.06] text-xs text-text-secondary"
              placeholder="Update..."
            />
          </div>
        </div>

        {/* Launch Day Tasks */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Launch Day Tasks</h2>
            <div className="text-sm text-text-secondary">
              {completedTasks}/{totalTasks} completed ({progressPercent}%)
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-bg-elevated border border-white/[0.06]"
              >
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    task.status === 'completed'
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : task.status === 'in-progress'
                      ? 'bg-gold/10 border-gold/20 text-gold'
                      : 'bg-white/[0.06] border-white/[0.12] text-text-secondary'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="flex-1">
                  <div className={`font-medium ${task.status === 'completed' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                    {task.task}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    {task.assignee} • {task.dueTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Monitoring */}
        <div className="rounded-2xl bg-bg-card border border-white/[0.06] p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Comments Needing Reply</h2>

          {pendingComments.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <div className="text-4xl mb-4">✅</div>
              <p>All caught up! No pending comments.</p>
              <p className="text-sm mt-2">
                Check ProductHunt page manually: <a href="https://www.producthunt.com/posts/pawcasso-atelier" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">View →</a>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingComments.map((comment) => (
                <div key={comment.id} className="rounded-xl bg-bg-elevated border border-white/[0.06] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium">{comment.author}</div>
                      <div className="text-xs text-text-secondary">
                        {new Date(comment.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setPendingComments(prev => prev.filter(c => c.id !== comment.id))}
                      className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-colors"
                    >
                      Mark Replied
                    </button>
                  </div>
                  <p className="text-text-secondary text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 rounded-xl bg-gold/10 border border-gold/20">
            <div className="font-medium text-gold mb-2">💡 Response Protocol</div>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Reply within 30 minutes during launch day (12 AM - 12 AM PT)</li>
              <li>• Be genuine, warm, and helpful</li>
              <li>• Answer questions thoroughly</li>
              <li>• Thank people for upvotes and support</li>
              <li>• Engage with feature requests and feedback</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.producthunt.com/posts/pawcasso-atelier"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-bg-card border border-white/[0.06] p-6 hover:border-gold/30 hover:bg-bg-elevated transition-all"
          >
            <div className="text-2xl mb-3">🚀</div>
            <div className="font-medium mb-2">ProductHunt Page</div>
            <div className="text-sm text-text-secondary">Monitor upvotes & comments</div>
          </a>

          <Link
            href="/launch/hunter-kit"
            className="rounded-xl bg-bg-card border border-white/[0.06] p-6 hover:border-gold/30 hover:bg-bg-elevated transition-all"
          >
            <div className="text-2xl mb-3">🎯</div>
            <div className="font-medium mb-2">Hunter Kit</div>
            <div className="text-sm text-text-secondary">Share with supporters</div>
          </Link>

          <Link
            href="/admin"
            className="rounded-xl bg-bg-card border border-white/[0.06] p-6 hover:border-gold/30 hover:bg-bg-elevated transition-all"
          >
            <div className="text-2xl mb-3">📊</div>
            <div className="font-medium mb-2">Admin Panel</div>
            <div className="text-sm text-text-secondary">Full analytics</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
