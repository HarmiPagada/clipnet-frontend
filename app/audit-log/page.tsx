'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import React from 'react'
import { Filter, Download } from 'lucide-react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'


 const mockAuditLogs = [
    { timestamp: '2025-01-09 14:35:00', user: 'admin@clipnet.ai', action: 'Retry failed job job-003', ip: '192.168.1.100' },
    { timestamp: '2025-01-09 14:20:15', user: 'dev@clipnet.ai', action: 'Clear stuck queue buffer', ip: '192.168.1.101' },
    { timestamp: '2025-01-09 13:45:30', user: 'admin@clipnet.ai', action: 'Refresh OAuth tokens', ip: '192.168.1.100' }
  ];

export default function AuditLog() {
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
                <h2 className="page-title">Audit Log</h2>
              </div>

            
                <div className="audit-container">
                    {/* Audit Filters */}
                    <div className="audit-filters-card">
                        <div className="filters-wrapper">
                        <div className="filter-group">
                            <Filter className="filter-icon" />
                            <select className="filter-select">
                            <option>All Users</option>
                            <option>admin@clipnet.ai</option>
                            <option>dev@clipnet.ai</option>
                            </select>
                        </div>
                        <select className="filter-select">
                            <option>Last 24 Hours</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                        <button className="export-button">
                            <Download className="export-icon" />
                            Export Audit Log
                        </button>
                        </div>
                    </div>

                    {/* Audit Log Table */}
                    <div className="audit-table-card">
                        <div className="table-header">
                        <h3 className="table-title">Audit Log</h3>
                        </div>
                        <div className="table-container">
                        <table className="audit-table">
                            <thead className="table-head">
                            <tr>
                                <th className="table-head-cell">Timestamp</th>
                                <th className="table-head-cell">User</th>
                                <th className="table-head-cell">Action</th>
                                <th className="table-head-cell">IP Address</th>
                            </tr>
                            </thead>
                            <tbody className="table-body">
                            {mockAuditLogs.map((log, index) => (
                                <tr key={index} className="table-row">
                                <td className="table-cell">{log.timestamp}</td>
                                <td className="table-cell-user">{log.user}</td>
                                <td className="table-cell-action">{log.action}</td>
                                <td className="table-cell">{log.ip}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
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