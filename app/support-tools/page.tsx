'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

import { Clock, FileText, RefreshCw, Settings, DollarSign } from 'lucide-react'

export default function SupportTools() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)

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
                                <h2 className="page-title">Support Tools</h2>
                            </div>                            

                            <div className="support-content-wrapper">
    
                                {/* Quick Actions */}
                                <div className="quick-actions-grid">
                                    <div className="action-card">
                                        <div className="action-icon action-icon-blue">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="action-title">Trial Extensions</h3>
                                        <p className="action-description">Extend user trial periods</p>
                                        <button className="action-button action-button-blue">
                                            Manage
                                        </button>
                                    </div>

                                    <div className="action-card">
                                        <div className="action-icon action-icon-green">
                                            <RefreshCw className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="action-title">Usage Resets</h3>
                                        <p className="action-description">Reset quotas and usage limits</p>
                                        <button className="action-button action-button-green">
                                            Manage
                                        </button>
                                    </div>

                                    <div className="action-card">
                                        <div className="action-icon action-icon-orange">
                                            <DollarSign className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <h3 className="action-title">Refunds</h3>
                                        <p className="action-description">Process customer refunds</p>
                                        <button className="action-button action-button-orange">
                                            Process
                                        </button>
                                    </div>

                                    <div className="action-card">
                                        <div className="action-icon action-icon-purple">
                                            <FileText className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <h3 className="action-title">Support Tickets</h3>
                                        <p className="action-description">View and manage tickets</p>
                                        <button className="action-button action-button-purple">
                                            View All
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Support Activities */}
                                <div className="support-activities-section">
                                    <div className="support-activities-header">
                                        <h3 className="support-activities-title">Recent Support Activities</h3>
                                    </div>
                                    <div className="activities-content">
                                        <div className="activities-list">
                                            {[
                                                { action: 'Trial Extended', user: 'john.doe@example.com', staff: 'support_001', time: '2 hours ago', details: 'Extended by 7 days' },
                                                { action: 'Quota Reset', user: 'sarah.wilson@company.com', staff: 'support_002', time: '4 hours ago', details: 'Monthly quota reset' },
                                                { action: 'Refund Processed', user: 'mike.brown@startup.co', staff: 'admin_001', time: '1 day ago', details: '$29.99 refund processed' }
                                            ].map((activity, index) => (
                                                <div key={index} className="activity-item">
                                                    <div className="activity-icon">
                                                        <Settings className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="activity-content">
                                                        <div className="activity-header">
                                                            <h4 className="activity-action">{activity.action}</h4>
                                                            <span className="activity-time">{activity.time}</span>
                                                        </div>
                                                        <p className="activity-info">User: {activity.user}</p>
                                                        <p className="activity-info">Staff: {activity.staff}</p>
                                                        <p className="activity-details">{activity.details}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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