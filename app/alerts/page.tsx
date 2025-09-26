'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import React from 'react'
import { Settings, AlertCircle, AlertTriangle } from 'lucide-react'

import '../styles/dashboard.css'


export default function Alerts() {
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

  
  const handleSignOut = () => {
    // Remove auth cookie/token
    clearAuthToken()
    
    // Redirect to login
    router.push('/auth/login')
  }

  
  return (
    // <div>
    //   <Header 
    //     darkMode={darkMode}
    //     onToggleDarkMode={toggleDarkMode}
    //   />
      
    //   <main>
    //     <div className="container">
    //       <div className="main-content">
    //         <Sidebar />

            <div className="left-content d-flex flex-column">
              <div className="clip-review-header">
                <h2 className="page-title">Alerts</h2>
              </div>

            
                <div className="alerts-container">
                {/* Alert Configuration */}
                <div className="alert-config-card">
                    <h3 className="alert-config-header">
                    <Settings className="alert-config-icon" />
                    Alert Configuration
                    </h3>
                    <div className="alert-config-grid">
                    <div className="form-group">
                        <label className="form-label">Queue Depth Threshold</label>
                        <input type="number" className="form-input" defaultValue="100" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">GPU Usage Threshold (%)</label>
                        <input type="number" className="form-input" defaultValue="90" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">API Failure Rate (per min)</label>
                        <input type="number" className="form-input" defaultValue="10" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notification Channel</label>
                        <select className="form-select">
                        <option>Discord Webhook</option>
                        <option>Slack</option>
                        <option>Email</option>
                        </select>
                    </div>
                    </div>
                    <div className="save-button-container">
                    <button className="save-button">
                        Save Configuration
                    </button>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="active-alerts-card">
                    <div className="active-alerts-header">
                    <h3 className="active-alerts-title">Active Alerts</h3>
                    </div>
                    <div className="alerts-list">
                    <div className="alert-item">
                        <AlertCircle className="alert-icon-red" />
                        <div className="alert-content">
                        <p className="alert-title">High GPU Utilization</p>
                        <p className="alert-description">GPU usage has been above 90% for 15 minutes</p>
                        </div>
                        <span className="alert-timestamp">5 min ago</span>
                    </div>
                    <div className="alert-item">
                        <AlertTriangle className="alert-icon-yellow" />
                        <div className="alert-content">
                        <p className="alert-title">Queue Depth Warning</p>
                        <p className="alert-description">Job queue depth has reached 75 jobs</p>
                        </div>
                        <span className="alert-timestamp">12 min ago</span>
                    </div>
                    </div>
                </div>
                </div>

           

            </div>
            

    //       </div>
    //     </div>
    //   </main>
    // </div>

  )
}