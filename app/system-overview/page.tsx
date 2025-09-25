'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Import all required icons from lucide-react
import { 
  Activity, 
  Clock, 
  Server, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  RotateCcw, 
  Trash2, 
  Shield,
  LucideIcon
} from 'lucide-react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// Type definitions
interface MockMetrics {
  uptime: string;
  latency: string;
  activeJobs: string;
  failedJobs: string;
  cpuUsage: number;
  gpuUsage: number;
  memoryUsage: number;
}

interface SystemStatus {
  streamBuffer: 'healthy' | 'warning' | 'error';
  inferenceQueue: 'healthy' | 'warning' | 'error';
  postingEngine: 'healthy' | 'warning' | 'error';
  clipBot: 'healthy' | 'warning' | 'error';
}

interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'error';
  label: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend?: number;
}

// Mock data for the dashboard
const mockMetrics: MockMetrics = {
  uptime: "99.8%",
  latency: "45ms",
  activeJobs: "23",
  failedJobs: "2",
  cpuUsage: 67,
  gpuUsage: 84,
  memoryUsage: 72
}

const systemStatus: SystemStatus = {
  streamBuffer: 'healthy',
  inferenceQueue: 'healthy', 
  postingEngine: 'warning',
  clipBot: 'healthy'
}

// StatusIndicator component
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const getStatusColor = (status: 'healthy' | 'warning' | 'error'): string => {
    switch(status) {
      case 'healthy': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

// MetricCard component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="p-4 rounded-lg border metrics-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
      {trend && (
        <div className="mt-2">
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default function MyAi() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState<boolean>(false)

  // Load dark mode preference on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'enabled') {
      setDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = (isDark: boolean): void => {
    setDarkMode(isDark)
    if (isDark) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'enabled')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'disabled')
    }
  }

  const handleSignOut = (): void => {
    // Remove auth cookie/token
    clearAuthToken();
    
    // Redirect to login
    router.push('/auth/login')
  }

  return (
    <div>
      <Header 
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main>
        <div className="container">
          <div className="main-content">
            <Sidebar/>

            <div className="left-content d-flex flex-column">

                <div className="clip-review-header">
                    <h2 className="page-title">System Overview</h2>
                </div>

                <div className="dashboard-container">
  {/* System Health */}
  <div className="dashboard-card">
    <h3 className="card-header">
      <Activity className="header-icon" />
      System Health
    </h3>
    <div className="status-grid">
      <StatusIndicator status={systemStatus.streamBuffer} label="Stream Buffer" />
      <StatusIndicator status={systemStatus.inferenceQueue} label="Inference Queue" />
      <StatusIndicator status={systemStatus.postingEngine} label="Posting Engine" />
      <StatusIndicator status={systemStatus.clipBot} label="ClipBOT" />
    </div>
  </div>

  {/* Key Metrics */}
  <div className="metrics-grid">
    <MetricCard title="System Uptime" value={mockMetrics.uptime} icon={Clock} color="green" trend={0.2} />
    <MetricCard title="Avg Latency" value={mockMetrics.latency} icon={Activity} color="blue" trend={-5.3} />
    <MetricCard title="Active Jobs" value={mockMetrics.activeJobs} icon={Server} color="purple" trend={12.5} />
    <MetricCard title="Failed Jobs" value={mockMetrics.failedJobs} icon={AlertTriangle} color="red" trend={-25} />
  </div>

  {/* Resource Monitoring */}
  <div className="dashboard-card resource-container">
    <h3 className="card-header">
      <BarChart3 className="header-icon" />
      Resource Utilization
    </h3>
    <div>
      <div className="resource-item">
        <div className="resource-info">
          <span className="resource-label">CPU Usage</span>
          <span className="resource-value">{mockMetrics.cpuUsage}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar cpu-progress"
            style={{ width: `${mockMetrics.cpuUsage}%` }}
          ></div>
        </div>
      </div>

      <div className="resource-item">
        <div className="resource-info">
          <span className="resource-label">GPU Usage</span>
          <span className="resource-value">{mockMetrics.gpuUsage}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar gpu-progress"
            style={{ width: `${mockMetrics.gpuUsage}%` }}
          ></div>
        </div>
      </div>

      <div className="resource-item">
        <div className="resource-info">
          <span className="resource-label">Memory Usage</span>
          <span className="resource-value">{mockMetrics.memoryUsage}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar memory-progress"
            style={{ width: `${mockMetrics.memoryUsage}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>

      {/* Quick Actions */}
      <div className="dashboard-card">
        <h3 className="card-header">
          <Settings className="header-icon" />
          Quick Actions
        </h3>
        <div className="actions-grid">
          <button className="action-btn action-btn-blue">
            <RefreshCw className="action-icon" />
            Restart Buffer
          </button>
          <button className="action-btn action-btn-green">
            <RotateCcw className="action-icon" />
            Retry Failed Jobs
          </button>
          <button className="action-btn action-btn-yellow">
            <Trash2 className="action-icon" />
            Clear Queue
          </button>
          <button className="action-btn action-btn-purple">
            <Shield className="action-icon" />
            Refresh OAuth
          </button>
        </div>
      </div>
    </div>


                {/* Footer */}
                <footer className=" border-t border-gray-200 mt-12">
                <div className="py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                      <div>© 2025 ClipNET Admin Dashboard - Secure Environment</div>
                      <div>Connected to: admin.clipnet.ai</div>
                    </div>
                </div>
                </footer>

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}