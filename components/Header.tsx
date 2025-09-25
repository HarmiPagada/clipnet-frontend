'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, LogOut, HelpCircle } from "lucide-react";

interface HeaderProps {
  darkMode?: boolean
  onToggleDarkMode?: (isDark: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mobile Menu Functions
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true)
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = "15px"
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = "auto"
    document.body.style.paddingRight = "0"
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        closeMobileMenu()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Dark mode toggle handlers
  const handleDarkModeToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggleDarkMode) {
      onToggleDarkMode(true)
    }
  }

  const handleLightModeToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggleDarkMode) {
      onToggleDarkMode(false)
    }
  }

  const handleDarkModeToggleMobile = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggleDarkMode) {
      onToggleDarkMode(true)
    }
    closeMobileMenu()
  }

  const handleLightModeToggleMobile = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggleDarkMode) {
      onToggleDarkMode(false)
    }
    closeMobileMenu()
  }

  //new code
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const closeDropdown = () => {
    setOpenDropdown(false);
  };

  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // Fixed the TypeScript error by properly typing the event parameter
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    }
    
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdown(false);
    }
    
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);
   
  return (
    <>
      <header>
        <div className="container">
          <div className="logo">
            <Link href="/">
              <Image src="/assets/images/w-logo.png" alt="ClipNET Logo" width={120} height={40} />
            </Link>
          </div>

          <div className="logo logo-dark">
            <Link href="/">
              <Image src="/assets/images/b-logo.png" alt="ClipNET Logo" width={120} height={40} />
            </Link>
          </div>

          <div className="header-icons">
            <ul className="header-icons-menu">
              <li className="dark-icon">
                <Link href="" onClick={handleDarkModeToggle}>
                  <i className="fa-regular fa-moon"></i>
                </Link>
              </li>
              <li className="light-icon">
                <Link href="" onClick={handleLightModeToggle}>
                  <i className="fa-solid fa-sun"></i>
                </Link>
              </li>
              <li className="search-icon">
                <Link href="#">
                  <Image src="/assets/images/search-icon.png" alt="Search Icon" width={25} height={25} />
                </Link>
              </li>

              <li className=" relative">
                <button onClick={toggleDropdown} className="icon-btn">
                  <Image
                    src="/assets/images/user-icon.png"
                    alt="User Icon"
                    width={25}
                    height={25}
                  />
                </button>

                {openDropdown && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="#" onClick={closeDropdown} className="dropdown-link">
                        <User size={18} /> <span>My Account</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" onClick={closeDropdown} className="dropdown-link">
                        <LogOut size={18} /> <span>Logout</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" onClick={closeDropdown} className="dropdown-link">
                        <HelpCircle size={18} /> <span>Get Help</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <button className="mobile-menu-toggle" onClick={openMobileMenu}>
            <i className="fa fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/">
            <Image src="/assets/images/w-logo.png" alt="ClipNET Logo" className="mobile-logo" width={120} height={40} />
          </Link>
          <Link href="/">
            <Image src="/assets/images/b-logo.png" alt="ClipNET Logo" className="mobile-logo-dark" width={120} height={40} />
          </Link>
          <button className="mobile-menu-close" onClick={closeMobileMenu}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="mobile-menu-content">
          {/* Navigation Menu */}
          <div className="mobile-menu-section">
          </div>

          {/* Tools & Settings */}
          <div className="mobile-menu-section">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="mobile-menu-list a mobile-dashboard-link flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <Image src="/assets/images/dashboard.png" alt="Dashboard Icon" width={20} height={20} />
              <span>Dashboard</span>
            </Link>

            <ul className="mobile-menu-list">
              {/* All Clips with dropdown */}
              <li className="icon-item relative" ref={ref}>
                <div className="flex items-center gap-2">
                  <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                    <Image src="/assets/images/home.png" alt="Home Icon" width={20} height={20} />
                    <span className="icon-text">All Clips</span>
                  </Link>

                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={dropdown}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdown((s) => !s);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setDropdown((s) => !s);
                    }}
                    className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform ${dropdown ? "rotate-180" : ""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {dropdown && (
                  <ul className="nav-menu ml-6 mt-2 space-y-1">
                    <li className="nav-item">
                      <Link href="/my-clips" onClick={closeMobileMenu}>
                        My Clips
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#" onClick={closeMobileMenu}>
                        My Templates
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#" onClick={closeMobileMenu}>
                        Community
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Other Single Links */}
              <li>
                <Link href="/my-ai" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <Image src="/assets/images/my ai.png" alt="AI" width={20} height={20} />
                  <span>My AI</span>
                </Link>
              </li>

              <li>
                <Link href="/my-team" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <Image src="/assets/images/my team.png" alt="Team" width={20} height={20} />
                  <span>My Team</span>
                </Link>
              </li>

              <li>
                <Link href="/my-preferences" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <Image src="/assets/images/settings.png" alt="Settings" width={20} height={20} />
                  <span>My Preferences</span>
                </Link>
              </li>

              <li>
                <Link href="/trainer" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <Image src="/assets/images/trainer.png" alt="Trainer" width={20} height={20} />
                  <span>Trainer</span>
                </Link>
              </li>

              {/* Admin Dashboard Dropdown */}
              <li className="icon-item relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 w-full">
                  <Image src="/assets/images/dashboard.png" alt="Dashboard Icon" width={20} height={20} />
                  <span className="icon-text">Admin Dashboard</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-auto w-4 h-4 transform transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <ul className="nav-menu ml-6 mt-2 space-y-1">
                    <li><Link href="/system-overview">System Overview</Link></li>
                    <li><Link href="/job-queue">Job Queue</Link></li>
                    <li><Link href="/logs-errors">Logs & Errors</Link></li>
                    <li><Link href="/alerts">Alerts</Link></li>
                    <li><Link href="/audit-log">Audit Log</Link></li>
                  </ul>
                )}
              </li>

              {/* Internal Staff Dropdown */}
              <li className="icon-item relative">
                <button onClick={() => setCrmOpen(!crmOpen)} className="flex items-center gap-2 w-full">
                  <Image src="/assets/images/settings.png" alt="Settings Icon" width={20} height={20} />
                  <span className="icon-text">Internal Staff</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-auto w-4 h-4 transform transition-transform ${crmOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {crmOpen && (
                  <ul className="nav-menu ml-6 mt-2 space-y-1">
                    <li><Link href="/user-management">User Management</Link></li>
                    <li><Link href="/billing">Billing</Link></li>
                    <li><Link href="/support-tools">Support Tools</Link></li>
                    <li><Link href="/compliance">Compliance</Link></li>
                    <li><Link href="/audit-log">Audit Log</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="mobile-menu-section">
            <h3>Quick Actions</h3>
            <ul className="mobile-menu-list">
              <li>
                <Link href="#" onClick={closeMobileMenu}>
                  <Image src="/assets/images/search-icon.png" alt="Search" width={20} height={20} />
                  <span>Search</span>
                </Link>
              </li>

              <li className="dark-icon">
                <Link href="#" onClick={handleDarkModeToggleMobile}>
                  <i className="fa-regular fa-moon"></i>
                  <span>Dark Mode</span>
                </Link>
              </li>

              <li className="light-icon">
                <Link href="#" onClick={handleLightModeToggleMobile}>
                  <i className="fa-solid fa-cloud-sun"></i>
                  <span>Light Mode</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="mobile-menu-section mobile-account-section">
            <ul className="mobileMenu-list">
              <li className="mobileMenu-item">
                <button onClick={toggleDropdown} className="mobileMenu-btn">
                  <Image
                    src="/assets/images/user-icon.png"
                    alt="Account"
                    width={20}
                    height={20}
                  />
                  <span>My Account</span>
                </button>

                {openDropdown && (
                  <ul className="mobileMenu-dropdown">
                    <li>
                      <Link
                        href="#"
                        onClick={closeDropdown}
                        className="mobileMenu-link"
                      >
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        onClick={closeDropdown}
                        className="mobileMenu-link"
                      >
                        Logout
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        onClick={closeDropdown}
                        className="mobileMenu-link"
                      >
                        Get Help
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header;