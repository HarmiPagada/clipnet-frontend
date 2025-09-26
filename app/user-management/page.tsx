'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearAuthToken } from '@/lib/auth'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

import { Search } from 'lucide-react'

// 🔹 Mock Data
type MockUser = {
  id: string
  email: string
  username: string
  plan: 'Free' | 'Pro' | 'Enterprise'
  status: 'active' | 'suspended' | 'banned'
  tokenBalance: number
  lastSeen: string
  created: string
  flags?: string[]
  notes?: string
}

const mockUsers: MockUser[] = [
  {
    id: 'usr_1234',
    email: 'john.doe@example.com',
    username: 'johndoe',
    plan: 'Pro',
    status: 'active',
    tokenBalance: 5000,
    lastSeen: '2024-01-29T10:30:00Z',
    created: '2023-06-15T09:00:00Z',
    flags: ['verified'],
    notes: 'Premium customer, early adopter',
  },
  {
    id: 'usr_5678',
    email: 'sarah.smith@company.com',
    username: 'sarahsmith',
    plan: 'Enterprise',
    status: 'active',
    tokenBalance: 15000,
    lastSeen: '2024-01-29T14:15:00Z',
    created: '2023-08-22T11:30:00Z',
    flags: ['enterprise', 'verified'],
    notes: 'Large enterprise client, priority support',
  },
]

// 🔹 User Card Component
type UserCardProps = {
  user: MockUser
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-info">
          <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <p className="username">{user.username}</p>
            <p className="email">{user.email}</p>
          </div>
        </div>
        <div className="user-badges">
          {user.flags?.map((flag) => (
            <span key={flag} className="flag-badge">
              {flag}
            </span>
          ))}
          <span
            className={`status-badge ${
              user.status === 'active' ? 'status-active' : 'status-inactive'
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-item">
          <p className="stat-label">Plan</p>
          <p className="stat-value">{user.plan}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Tokens</p>
          <p className="stat-value">{user.tokenBalance.toLocaleString()}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Last Seen</p>
          <p className="stat-date">
            {mounted ? new Date(user.lastSeen).toLocaleDateString('en-US') : ''}
          </p>
        </div>
      </div>

      {user.notes && (
        <div className="user-notes">
          <p className="notes-text">{user.notes}</p>
        </div>
      )}
    </div>
  )
}

// 🔹 Main Page
const UserManagement: React.FC = () => {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // 🔹 Dark Mode Effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode === 'enabled') {
        setDarkMode(true)
        document.body.classList.add('dark-mode')
      }
    }
  }, [])

  const toggleDarkMode = (isDark: boolean) => {
    setDarkMode(isDark)
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark-mode')
        localStorage.setItem('darkMode', 'enabled')
      } else {
        document.body.classList.remove('dark-mode')
        localStorage.setItem('darkMode', 'disabled')
      }
    }
  }

  const handleSignOut = () => {
    clearAuthToken()
    router.push('/auth/login')
  }

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    // <div>
    //   <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
    //   <main>
    //     <div className="container">
    //       <div className="main-content">
    //         <Sidebar />

            <div className="left-content d-flex flex-column">
              <div className="clip-review-header">
                <h2 className="page-title">User Management</h2>
              </div>

              <div className="user-management-content">
                {/* Search Bar */}
                <div className="user-search-container">
                  <div className="user-search-wrapper">
                    <div className="user-search-input-container">
                      <Search className="user-search-icon" />
                      <input
                        type="text"
                        placeholder="Search by email, username, or account ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="user-search-input"
                      />
                    </div>
                    <div className="user-filter-container">
                      <select className="user-filter-select">
                        <option>All Plans</option>
                        <option>Free</option>
                        <option>Pro</option>
                        <option>Enterprise</option>
                      </select>
                      <select className="user-filter-select">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Suspended</option>
                        <option>Banned</option>
                      </select>
                      <button className="user-search-button">Search</button>
                    </div>
                  </div>
                </div>

                {/* User Cards */}
                <div className="user-cards-grid">
                  {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            </div>

    //       </div>
    //     </div>
    //   </main>
    // </div>
  )
}

export default UserManagement
