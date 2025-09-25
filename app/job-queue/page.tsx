'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import React from 'react'
import { 
  PlayCircle, 
  XCircle, 
  Database, 
  Clock, 
  RefreshCw, 
  Trash2, 
  RotateCcw, 
  Eye 
} from 'lucide-react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// Types
interface Job {
  id: string
  type: string
  status: 'processing' | 'completed' | 'failed' | 'queued'
  duration: string
  service: string
}

interface MetricCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<any>
  color: 'blue' | 'red' | 'yellow' | 'green'
}

interface JobRowProps {
  job: Job
  onRetry: (id: string) => void
  onCancel: (id: string) => void
}

// MetricCard Component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className={`metric-card ${color}`}>
      <div className="metric-card-content">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
      <Icon className="metric-card-icon" />
    </div>
  )
}

// JobRow Component
const JobRow: React.FC<JobRowProps> = ({ job, onRetry, onCancel }) => {
  return (
    <tr className="job-table-row">
      <td className="job-table-td job-id">{job.id}</td>
      <td className="job-table-td job-type">{job.type}</td>
      <td className="job-table-td">
        <span className={`status-badge ${job.status}`}>
          {job.status}
        </span>
      </td>
      <td className="job-table-td job-duration">{job.duration}</td>
      <td className="job-table-td job-service">{job.service}</td>
      <td className="job-table-td job-actions">
        <div className="job-actions">
          {job.status === 'failed' && (
            <button 
              onClick={() => onRetry(job.id)}
              className="action-btn retry"
              title="Retry Job"
            >
              <RotateCcw className="action-btn-icon" />
            </button>
          )}
          {job.status === 'processing' && (
            <button 
              onClick={() => onCancel(job.id)}
              className="action-btn cancel"
              title="Cancel Job"
            >
              <XCircle className="action-btn-icon" />
            </button>
          )}
          <button 
            className="action-btn view"
            title="View Details"
          >
            <Eye className="action-btn-icon" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function JobQueue() {
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
  const toggleDarkMode = (isDark: boolean) => {
    setDarkMode(isDark)
    if (isDark) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'enabled')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'disabled')
    }
  }

  const handleSignOut = () => {
    // Remove auth cookie/token
    clearAuthToken()
    
    // Redirect to login
    router.push('/auth/login')
  }


  // Mock data for demonstration
  const mockMetrics = {
    uptime: '99.8%',
    latency: '45ms',
    activeJobs: 127,
    failedJobs: 3,
    cpuUsage: 68,
    gpuUsage: 85,
    memoryUsage: 72,
    queueDepth: 45,
    tokensConsumed: '1.2M',
    activeStreams: 15,
    vodSessions: 8
  }

  const mockJobs: Job[] = [
    { id: 'job-001', type: 'inference', status: 'processing', duration: '2m 15s', service: 'BLIP' },
    { id: 'job-002', type: 'buffer', status: 'completed', duration: '45s', service: 'Stream Buffer' },
    { id: 'job-003', type: 'posting', status: 'failed', duration: '1m 30s', service: 'YouTube API' },
    { id: 'job-004', type: 'polishing', status: 'queued', duration: '-', service: 'Gemini' }
  ]

  // Handler functions
  const handleRetryJob = (jobId: string) => {
    console.log('Retry job:', jobId)
    // Add retry logic here
  }

  const handleCancelJob = (jobId: string) => {
    console.log('Cancel job:', jobId)
    // Add cancel logic here
  }

  const handleRefreshJobs = () => {
    console.log('Refreshing jobs...')
    // Add refresh logic here
  }

  const handleClearFailedJobs = () => {
    console.log('Clearing failed jobs...')
    // Add clear failed jobs logic here
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
            <Sidebar />

            <div className="left-content d-flex flex-column">
              <div className="clip-review-header">
                <h2 className="page-title">Job Queue</h2>
              </div>

                <div className="job-queue-container">
                    {/* Job Statistics */}
                    <div className="metrics-grid">
                        <MetricCard 
                        title="Active Jobs" 
                        value={mockMetrics.activeJobs} 
                        icon={PlayCircle} 
                        color="blue" 
                        />
                        <MetricCard 
                        title="Failed Jobs" 
                        value={mockMetrics.failedJobs} 
                        icon={XCircle} 
                        color="red" 
                        />
                        <MetricCard 
                        title="Queue Depth" 
                        value={mockMetrics.queueDepth} 
                        icon={Database} 
                        color="yellow" 
                        />
                        <MetricCard 
                        title="Avg Processing Time" 
                        value="3m 45s" 
                        icon={Clock} 
                        color="green" 
                        />
                    </div>

                    {/* Job Queue Management */}
                    <div className="job-queue-table-container">
                        <div className="job-queue-header">
                        <div className="job-queue-header-content">
                            <h3 className="job-queue-title">Job Queue</h3>
                            <div className="job-queue-actions">
                            <button 
                                onClick={handleRefreshJobs}
                                className="btn-refresh"
                            >
                                <RefreshCw className="btn-icon" />
                                Refresh
                            </button>
                            <button 
                                onClick={handleClearFailedJobs}
                                className="btn-clear-failed"
                            >
                                <Trash2 className="btn-icon" />
                                Clear Failed
                            </button>
                            </div>
                        </div>
                        </div>
                        
                        <div className="job-table-wrapper">
                        <table className="job-table">
                            <thead className="job-table-header">
                            <tr>
                                <th className="job-table-th">Job ID</th>
                                <th className="job-table-th">Type</th>
                                <th className="job-table-th">Status</th>
                                <th className="job-table-th">Duration</th>
                                <th className="job-table-th">Service</th>
                                <th className="job-table-th job-table-th-actions">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="job-table-body">
                            {mockJobs.map((job) => (
                                <JobRow 
                                key={job.id} 
                                job={job} 
                                onRetry={handleRetryJob}
                                onCancel={handleCancelJob}
                                />
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}