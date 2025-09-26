'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

import { AlertTriangle, Ban, FileText, XCircle } from 'lucide-react'

export default function Billing() {
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
    // <div>
   
    //     <Header 
    //       darkMode={darkMode}
    //       onToggleDarkMode={toggleDarkMode}
    //     />
    //         <main>
    //             <div className="container">
    //                 <div className="main-content">
    //                     <Sidebar/>

                        <div className="left-content d-flex flex-column">
                            <div className="clip-review-header">
                                <h2 className="page-title">Compliance & Enforcement</h2>
                            </div>

                            <div className="compliance-content-wrapper">
                                {/* Compliance Stats */}
                                <div className="compliance-stats-grid">
                                    <div className="compliance-stat-card">
                                        <div className="compliance-stat-header">
                                            <div className="compliance-icon-wrapper compliance-icon-red">
                                                <Ban className="w-5 h-5 text-red-600" />
                                            </div>
                                            <span className="compliance-percentage-badge compliance-percentage-red">-25%</span>
                                        </div>
                                        <div className="compliance-stat-content">
                                            <p className="compliance-stat-value">8</p>
                                            <p className="compliance-stat-label">Active Suspensions</p>
                                        </div>
                                    </div>

                                    <div className="compliance-stat-card">
                                        <div className="compliance-stat-header">
                                            <div className="compliance-icon-wrapper compliance-icon-gray">
                                                <XCircle className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <span className="compliance-percentage-badge compliance-percentage-gray">0%</span>
                                        </div>
                                        <div className="compliance-stat-content">
                                            <p className="compliance-stat-value">3</p>
                                            <p className="compliance-stat-label">Banned Accounts</p>
                                        </div>
                                    </div>

                                    <div className="compliance-stat-card">
                                        <div className="compliance-stat-header">
                                            <div className="compliance-icon-wrapper compliance-icon-yellow">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            <span className="compliance-percentage-badge compliance-percentage-yellow">+12%</span>
                                        </div>
                                        <div className="compliance-stat-content">
                                            <p className="compliance-stat-value">15</p>
                                            <p className="compliance-stat-label">Abuse Reports</p>
                                        </div>
                                    </div>

                                    <div className="compliance-stat-card">
                                        <div className="compliance-stat-header">
                                            <div className="compliance-icon-wrapper compliance-icon-purple">
                                                <FileText className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <span className="compliance-percentage-badge compliance-percentage-purple">+2</span>
                                        </div>
                                        <div className="compliance-stat-content">
                                            <p className="compliance-stat-value">5</p>
                                            <p className="compliance-stat-label">DMCA Requests</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Enforcement Actions */}
                                <div className="enforcement-actions-section">
                                    <div className="enforcement-actions-header">
                                        <h3 className="enforcement-actions-title">Recent Enforcement Actions</h3>
                                    </div>
                                    <div className="enforcement-table-wrapper">
                                        <table className="enforcement-table">
                                            <thead className="enforcement-table-header">
                                                <tr>
                                                    <th>Action</th>
                                                    <th>User</th>
                                                    <th>Reason</th>
                                                    <th>Staff</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="enforcement-table-body">
                                                {[
                                                    { action: 'Suspended', user: 'spammer@fake.com', reason: 'Spam content', staff: 'admin_001', date: '2024-01-29', status: 'Active' },
                                                    { action: 'Banned', user: 'abuser@test.com', reason: 'TOS violation', staff: 'admin_002', date: '2024-01-28', status: 'Permanent' },
                                                    { action: 'Warning', user: 'user@example.com', reason: 'Minor violation', staff: 'mod_001', date: '2024-01-27', status: 'Resolved' }
                                                ].map((enforcement, index) => (
                                                    <tr key={index} className="enforcement-table-row">
                                                        <td className="enforcement-table-cell">
                                                            <span className={`enforcement-action-badge ${
                                                                enforcement.action === 'Banned' ? 'enforcement-action-banned' :
                                                                enforcement.action === 'Suspended' ? 'enforcement-action-suspended' :
                                                                'enforcement-action-warning'
                                                            }`}>
                                                                {enforcement.action}
                                                            </span>
                                                        </td>
                                                        <td className="enforcement-table-cell enforcement-table-cell-text">{enforcement.user}</td>
                                                        <td className="enforcement-table-cell enforcement-table-cell-muted">{enforcement.reason}</td>
                                                        <td className="enforcement-table-cell enforcement-table-cell-muted">{enforcement.staff}</td>
                                                        <td className="enforcement-table-cell enforcement-table-cell-muted">{enforcement.date}</td>
                                                        <td className="enforcement-table-cell enforcement-table-cell-right">
                                                            <button className="enforcement-action-button enforcement-action-button-view">View</button>
                                                            <button className="enforcement-action-button enforcement-action-button-remove">Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>

    //                 </div>
    //             </div>
    //         </main>
    // </div>

  )
}