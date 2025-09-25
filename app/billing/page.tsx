'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

import { CreditCard, DollarSign, Download, RefreshCw, TrendingUp } from 'lucide-react'

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
                          

                          {/* Updated JSX code with custom CSS classes */}
                            <div className="content-wrapper">
                            <div className="clip-review-header">
                                <h2 className="page-title">Billing Overview</h2>
                                <button className="export-button">
                                <Download className="w-4 h-4" />
                                <span>Export Report</span>
                                </button>
                            </div>

                            {/* Billing Stats */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                <div className="stat-header">
                                    <div className="icon-wrapper icon-green">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="percentage-badge percentage-positive">+15.8%</span>
                                </div>
                                <div className="stat-content">
                                    <p className="stat-value">$89,400</p>
                                    <p className="stat-label">Monthly Revenue</p>
                                </div>
                                </div>

                                <div className="stat-card">
                                <div className="stat-header">
                                    <div className="icon-wrapper icon-blue">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="percentage-badge percentage-positive">+8.2%</span>
                                </div>
                                <div className="stat-content">
                                    <p className="stat-value">2,340</p>
                                    <p className="stat-label">Active Subscriptions</p>
                                </div>
                                </div>

                                <div className="stat-card">
                                <div className="stat-header">
                                    <div className="icon-wrapper icon-orange">
                                    <RefreshCw className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="percentage-badge percentage-negative">-12.3%</span>
                                </div>
                                <div className="stat-content">
                                    <p className="stat-value">23</p>
                                    <p className="stat-label">Refunds (30d)</p>
                                </div>
                                </div>

                                <div className="stat-card">
                                <div className="stat-header">
                                    <div className="icon-wrapper icon-purple">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="percentage-badge percentage-positive">+5.1%</span>
                                </div>
                                <div className="stat-content">
                                    <p className="stat-value">$38.20</p>
                                    <p className="stat-label">ARPU</p>
                                </div>
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="transactions-section">
                                <div className="transactions-header">
                                <h3 className="transactions-title">Recent Transactions</h3>
                                </div>
                                <div className="table-wrapper">
                                <table className="transactions-table">
                                    <thead className="table-header">
                                    <tr>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Plan</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        { id: 'txn_001', customer: 'john.doe@example.com', amount: '$29.99', plan: 'Pro', status: 'Completed', date: '2024-01-29' },
                                        { id: 'txn_002', customer: 'sarah.smith@company.com', amount: '$99.99', plan: 'Enterprise', status: 'Completed', date: '2024-01-29' },
                                        { id: 'txn_003', customer: 'mike.wilson@startup.co', amount: '$19.99', plan: 'Starter', status: 'Failed', date: '2024-01-28' }
                                    ].map(transaction => (
                                        <tr key={transaction.id} className="table-row">
                                        <td className="table-cell">{transaction.customer}</td>
                                        <td className="table-cell table-cell-bold">{transaction.amount}</td>
                                        <td className="table-cell">{transaction.plan}</td>
                                        <td className="table-cell">
                                            <span className={`status-badge ${
                                            transaction.status === 'Completed' ? 'status-completed' : 'status-failed'
                                            }`}>
                                            {transaction.status}
                                            </span>
                                        </td>
                                        <td className="table-cell">{transaction.date}</td>
                                        <td className="table-cell table-cell-right">
                                            <button className="action-link">View</button>
                                        </td>
                                        </tr>
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