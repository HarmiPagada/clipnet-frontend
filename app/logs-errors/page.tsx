'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import React from 'react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// Add these imports at the top of your file after the existing imports:

import { Filter, Search, Download } from 'lucide-react'

// Also add this mock data array before your component:
 const mockLogs = [
    { timestamp: '2025-01-09 14:30:25', level: 'ERROR', service: 'ClipBOT', message: 'Discord API rate limit exceeded' },
    { timestamp: '2025-01-09 14:28:12', level: 'WARN', service: 'Inference Queue', message: 'High GPU utilization detected' },
    { timestamp: '2025-01-09 14:25:08', level: 'INFO', service: 'Stream Buffer', message: 'Buffer recalibration completed' }
  ];

export default function LogsErrors() {
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
                <h2 className="page-title">Logs & Errors</h2>
              </div>

             

              <div className="logs-container">
                {/* Log Filters */}
                <div className="logs-filter-container">
                  <div className="filter-controls">
                    <div className="filter-item">
                      <Filter className="filter-icon" />
                      <select className="filter-select">
                        <option>All Services</option>
                        <option>Stream Buffer</option>
                        <option>Inference Queue</option>
                        <option>ClipBOT</option>
                      </select>
                    </div>
                    <select className="filter-select">
                      <option>All Levels</option>
                      <option>ERROR</option>
                      <option>WARN</option>
                      <option>INFO</option>
                    </select>
                    <div className="filter-item">
                      <Search className="filter-icon" />
                      <input 
                        type="text" 
                        placeholder="Search logs..." 
                        className="search-input"
                      />
                    </div>
                    <button className="export-btn">
                      <Download className="export-icon" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Error Logs */}
                <div className="system-logs-container">
                  <div className="logs-header">
                    <h3 className="logs-title">System Logs</h3>
                  </div>
                  <div className="logs-list">
                    {mockLogs.map((log, index) => (
                      <div key={index} className="log-item">
                        <div className="log-content">
                          <span className={`log-level-badge ${
                            log.level === 'ERROR' ? 'log-level-error' :
                            log.level === 'WARN' ? 'log-level-warn' :
                            'log-level-info'
                          }`}>
                            {log.level}
                          </span>
                          <div className="log-details">
                            <div className="log-details-header">
                              <div>
                                <p className="log-service">{log.service}</p>
                                <p className="log-message">{log.message}</p>
                              </div>
                              <span className="log-timestamp">{log.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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