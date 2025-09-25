'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// import './dashboard.css'
import '../styles/dashboard.css';

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  DoughnutController
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  DoughnutController
);

export default function DashboardPage() {
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

  // Chart initialization
  useEffect(() => {
    // Clean up any existing charts
    const destroyExistingChart = (canvasId: string) => {
      const existingChart = ChartJS.getChart(canvasId);
      if (existingChart) {
        existingChart.destroy();
      }
    };

    // Highlights Chart
    const highlightsCtx = document.getElementById('highlightsChart') as HTMLCanvasElement;
    if (highlightsCtx) {
      destroyExistingChart('highlightsChart');
      new ChartJS(highlightsCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Revenue',
              data: [2400, 1800, 3200, 2800, 4200, 3600, 4800, 4200, 5600, 5200, 6400, 6800],
              borderColor: '#9a57ff',
              backgroundColor: 'rgba(154, 87, 255, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Views',
              data: [1200, 1600, 2400, 2000, 3200, 2800, 3600, 3200, 4400, 4000, 5200, 5600],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f1f1f1'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Clips Chart (Bar Chart)
    const clipsCtx = document.getElementById('clipsChart') as HTMLCanvasElement;
    if (clipsCtx) {
      destroyExistingChart('clipsChart');
      new ChartJS(clipsCtx, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Clips Generated',
            data: [580, 720, 650, 890],
            backgroundColor: 'rgba(154, 87, 255, 0.8)',
            borderColor: '#9a57ff',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f1f1f1'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Earnings Chart (Doughnut)
    const earningsCtx = document.getElementById('earningsChart') as HTMLCanvasElement;
    if (earningsCtx) {
      destroyExistingChart('earningsChart');
      new ChartJS(earningsCtx, {
        type: 'doughnut',
        data: {
          labels: ['Affiliate', 'Direct Sales', 'Referrals'],
          datasets: [{
            data: [53, 30, 17],
            backgroundColor: ['#9a57ff', '#10b981', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  }, []);

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

              {/* Main Dashboard */}
              {/* <div className="dashboard-section"> */}
              <div className="left-content">

                {/* Header */}
                <div className="section-header">
                  <div>
                    <h1 className="section-title">Become an Affiliate</h1>
                    <p
                      className="section-description"
                      style={{ margin: "5px 0 0 0", color: "#666" }}
                    >
                      Earn just by referring your viewers.
                    </p>
                  </div>
                  <button className="learn-more-btn">Learn More</button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Community</div>
                    <div className="stat-value">$4,567.53</div>
                    <div className="stat-change">↗ +18% vs last month</div>
                    <i className="fas fa-users stat-icon"></i>
                  </div>
                  <div className="stat-card success">
                    <div className="stat-label">Clip Views</div>
                    <div className="stat-value">$4,567.53</div>
                    <div className="stat-change">↗ +24% vs last month</div>
                    <i className="fas fa-play stat-icon"></i>
                  </div>
                  <div className="stat-card warning">
                    <div className="stat-label">Revenue</div>
                    <div className="stat-value">$4,567.53</div>
                    <div className="stat-change">↗ +12% vs last month</div>
                    <i className="fas fa-dollar-sign stat-icon"></i>
                  </div>
                  <div className="stat-card danger">
                    <div className="stat-label">Referrals</div>
                    <div className="stat-value">$4,567.53</div>
                    <div className="stat-change">↗ +8% vs last month</div>
                    <i className="fas fa-share stat-icon"></i>
                  </div>
                  <div className="stat-card info">
                    <div className="stat-label">Conversion</div>
                    <div className="stat-value">$4,567.53</div>
                    <div className="stat-change">↗ +15% vs last month</div>
                    <i className="fas fa-chart-pie stat-icon"></i>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                  {/* Highlights Chart */}
                  <div className="chart-container">
                    <div className="chart-title">Highlights</div>
                    <div className="big-chart-wrapper">
                      <canvas id="highlightsChart"></canvas>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="chart-container">
                    <div className="chart-title">Clips Generated</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "24px", fontWeight: 700 }}>2.74k</div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          Total clips
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "var(--success-color)",
                          }}
                        >
                          6.24k
                        </div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          This month
                        </div>
                      </div>
                    </div>
                    <div className="chart-wrapper" style={{ height: "200px" }}>
                      <canvas id="clipsChart"></canvas>
                    </div>

                    <div style={{ marginTop: "30px" }}>
                      <div className="chart-title">Affiliate Earnings</div>
                      <div style={{ textAlign: "center", margin: "20px 0" }}>
                        <div
                          style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--accent-color)",
                          }}
                        >
                          $4055.56
                        </div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          Total earnings this year
                        </div>
                      </div>
                      <div style={{ position: "relative", height: "150px" }}>
                        <canvas id="earningsChart"></canvas>
                      </div>
                    </div>
                  </div>
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