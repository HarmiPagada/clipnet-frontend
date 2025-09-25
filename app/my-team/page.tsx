'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Myteam() {
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

                        <div className="left-content">

                            <div className="clip-review-header">
                              <h2>My Team</h2>
                            </div>

                            <div className="team-col">
                                <section className="invite-section">
                                    <h3>Invite members</h3>
                                    <div className="invite-form">
                                        <input type="email" placeholder="Enter Your Email" />
                                        <button className="clip-btn invite-button">Send invite <i
                                                className="fa-solid fa-paper-plane"></i></button>
                                    </div>
                                </section>

                                <section className="admin-section">
                                    <h3>Admin</h3>
                                    <div className="admin-card">
                                        <i className="fa-solid fa-user"></i>

                                        <div>
                                            <strong>John Doe</strong><br />
                                            <span className="admin-role">Admin</span>
                                        </div>
                                    </div>
                                </section>
                            </div>


                            {/* Team Table */}
                            <div className="table-wrapper">
                              <div className="team-section">
                                <div className="chart-title">My Team</div>
                                <table className="team-table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Team Name</th>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th>Type</th>
                                      <th>Status</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>
                                        <div className="team-member">
                                          <div className="member-avatar">D</div>
                                          <div className="member-info">
                                            <h4>Design Team</h4>
                                            <p>Creative Division</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td>John Doe</td>
                                      <td>john@example.com</td>
                                      <td>Designer</td>
                                      <td>
                                        <span className="status-badge status-active">Active</span>
                                      </td>
                                      <td>
                                        <button className="action-btn btn-edit">
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn btn-delete">
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>
                                        <div className="team-member">
                                          <div className="member-avatar">M</div>
                                          <div className="member-info">
                                            <h4>Marketing Team</h4>
                                            <p>Growth Division</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td>Jane Smith</td>
                                      <td>jane@example.com</td>
                                      <td>Manager</td>
                                      <td>
                                        <span className="status-badge status-active">Active</span>
                                      </td>
                                      <td>
                                        <button className="action-btn btn-edit">
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn btn-delete">
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>
                                        <div className="team-member">
                                          <div className="member-avatar">T</div>
                                          <div className="member-info">
                                            <h4>Tech Team</h4>
                                            <p>Development Division</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td>Mike Johnson</td>
                                      <td>mike@example.com</td>
                                      <td>Developer</td>
                                      <td>
                                        <span className="status-badge status-inactive">Inactive</span>
                                      </td>
                                      <td>
                                        <button className="action-btn btn-edit">
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn btn-delete">
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>4</td>
                                      <td>
                                        <div className="team-member">
                                          <div className="member-avatar">S</div>
                                          <div className="member-info">
                                            <h4>Sales Team</h4>
                                            <p>Revenue Division</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td>Sarah Wilson</td>
                                      <td>sarah@example.com</td>
                                      <td>Sales Rep</td>
                                      <td>
                                        <span className="status-badge status-active">Active</span>
                                      </td>
                                      <td>
                                        <button className="action-btn btn-edit">
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn btn-delete">
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                  
                                </table>
                              </div>
                            </div>

                        </div>

                    </div>
                </div>
            </main>
    </div>

  )
}