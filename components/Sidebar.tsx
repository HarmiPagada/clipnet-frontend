"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Settings as SettingsIcon, Users as UsersIcon, CreditCard as CreditCardIcon, Shield as ShieldIcon } from 'lucide-react';
import { Film, LayoutTemplate, UserCircle2 } from 'lucide-react';

import { BASE_PATH } from "../src/config";

export default function Sidebar() {

    const [isOpen, setIsOpen] = useState(false);

    // Initialize sidebar state from localStorage on component mount
    useEffect(() => {
        const savedSidebarState = localStorage.getItem("sidebarState");
        if (savedSidebarState === "open") {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 993) {
                setIsOpen(false);
                localStorage.setItem("sidebarState", "closed");
            } else if (window.innerWidth >= 1081) {
                setIsOpen(true);
                localStorage.setItem("sidebarState", "open");
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Toggle sidebar function
    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        localStorage.setItem("sidebarState", newState ? "open" : "closed");
    };

    //new code
    const [dropdown, setDropdown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
  const menuRef = useRef<HTMLUListElement>(null);

  const [crmOpen, setCrmOpen] = useState(false);
  const crmRef = useRef<HTMLUListElement>(null);

  // Admin Dashboard dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Internal Staff dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (crmRef.current && !crmRef.current.contains(event.target as Node)) {
        setCrmOpen(false);
      }
    };

    if (crmOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [crmOpen]);
    

    return (
        <div>
            <div className={`right-sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-items">
                    <div className="sidebar-toggle" onClick={toggleSidebar}>
                        <Link href="#">
                            <img src="/assets/images/sidebar.svg" alt="Hamburger Icon" />
                        </Link>
                    </div>

                    <ul className="right-sidebar-menu">
                        <li className="icon-item dashboard-icon">
                            <Link href={`${BASE_PATH}/dashboard`}>
                                <img src={`${BASE_PATH}/assets/images/dashboard.png`} alt="Dashboard Icon" />
                                <span className="icon-text">Dashboard</span>
                            </Link>
                        </li>

                       <div className="sidebar-menu" ref={ref}>
                            <li className="icon-item">
                                <button
                                onClick={() => setDropdown(!dropdown)}
                                className="flex items-center justify-between w-full"
                                >
                                <span className="flex items-center space-x-2">
                                    <Film className="w-5 h-5" />
                                    <span className="icon-text">Clips</span>
                                </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={
                                    dropdown
                                        ? "rotate transition-transform duration-200"
                                        : "transition-transform duration-200"
                                    }
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                                </button>

                                {dropdown && (
                                <ul className="dropdown pl-6 mt-2 space-y-1">
                                    <li className="icon-item">
                                        <Link href="/" className="flex items-center space-x-2 w-full">
                                        <img src={`${BASE_PATH}/assets/images/home.png`} alt="Home Icon"/>
                                        <span className="icon-text dropdown-text">All Clips</span>
                                        </Link>
                                    </li>

                                    <li className="icon-item">
                                        <Link href="/my-clips" className="flex items-center space-x-2 w-full">
                                        <Film className="w-5 h-5" />
                                        <span className="icon-text dropdown-text">My Clips</span>
                                        </Link>
                                    </li>

                                    <li className="icon-item">
                                        <Link href="#" className="flex items-center space-x-2 w-full">
                                        <LayoutTemplate className="w-5 h-5" />
                                        <span className="icon-text dropdown-text">My Templates</span>
                                        </Link>
                                    </li>

                                    <li className="icon-item">
                                        <Link href="#" className="flex items-center space-x-2 w-full">
                                        <UserCircle2 className="w-5 h-5" />
                                        <span className="icon-text dropdown-text">Community</span>
                                        </Link>
                                    </li>
                                </ul>

                                )}
                            </li>
                        </div>

                        <li className="icon-item">
                            <Link href="/my-ai">
                                <img src={`${BASE_PATH}/assets/images/my ai.png`} alt="AI Icon" />
                                <span className="icon-text">My AI</span>
                            </Link>
                        </li>
                        
                        <li className="icon-item">
                            <Link href="/my-team">
                                <img src={`${BASE_PATH}/assets/images/my team.png`} alt="Team Icon" />
                                <span className="icon-text">My Team</span>
                            </Link>
                        </li>
                        
                        <li className="icon-item">
                            <Link href="/my-preferences">
                                <img src={`${BASE_PATH}/assets/images/settings.png`} alt="Settings Icon" />
                                <span className="icon-text">My Preferences</span>
                            </Link>
                        </li>

                        <li className="icon-item">
                            <Link href="/trainer">
                                <img src={`${BASE_PATH}/assets/images/trainer.png`} alt="Settings Icon" />
                                <span className="icon-text">Trainer</span>
                            </Link>
                        </li>

                        <ul className="sidebar-menu"  ref={menuRef}>
                            <li className="icon-item">
                                <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center justify-between w-full"
                                >
                                <span className="flex items-center space-x-2">
                                    <img
                                    src={`${BASE_PATH}/assets/images/dashboard.png`}
                                    alt="Dashboard Icon"
                                    />
                                    <span className="icon-text">Admin Dashboard</span>
                                </span>

                                {/* Arrow fix → use menuOpen instead of crmOpen */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={
                                    menuOpen
                                        ? "rotate transition-transform duration-200"
                                        : "transition-transform duration-200"
                                    }
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                                </button>

                                {menuOpen && (
                                <ul className="dropdown pl-6 mt-2 space-y-1">
                                    <li className="icon-item">
                                    <Link
                                        href="/system-overview"
                                        className="flex items-center space-x-2 w-full"
                                    >
                                        <img
                                        src={`${BASE_PATH}/assets/images/system-overview.png`}
                                        alt="System"
                                        />
                                        <span className="icon-text dropdown-text">System Overview</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link
                                        href="/job-queue"
                                        className="flex items-center space-x-2 w-full"
                                    >
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                        >
                                        <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                                        <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                                        <line x1="6" x2="6.01" y1="6" y2="6"></line>
                                        <line x1="6" x2="6.01" y1="18" y2="18"></line>
                                        </svg>
                                        <span className="icon-text dropdown-text">Job Queue</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link
                                        href="/logs-errors"
                                        className="flex items-center space-x-2 w-full"
                                    >
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                        <span className="icon-text dropdown-text">Logs & Errors</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link href="/alerts" className="flex items-center space-x-2 w-full">
                                        <i className="fa-regular fa-bell"></i>
                                        <span className="icon-text dropdown-text">Alerts</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link
                                        href="/audit-log"
                                        className="flex items-center space-x-2 w-full"
                                    >
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                            >
                                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                            </svg>
                                            <span className="icon-text dropdown-text">Audit Log</span>
                                        </Link>
                                        </li>
                                    </ul>
                                    )}
                            </li>
                        </ul>


                        {/* //crm dropdown */}
                        <ul className="sidebar-menu" ref={crmRef}>
                            <li className="icon-item">
                                <button
                                onClick={() => setCrmOpen(!crmOpen)}
                                className="flex items-center justify-between w-full"
                                >
                                <span className="flex items-center space-x-2">
                                    <img
                                    src={`${BASE_PATH}/assets/images/settings.png`}
                                    alt="Settings Icon"
                                    />
                                    <span className="icon-text">Internal staff</span>
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={
                                    crmOpen
                                        ? "rotate transition-transform duration-200"
                                        : "transition-transform duration-200"
                                    }
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                    id="crm-arrow"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                                </button>

                                {crmOpen && (
                                <ul className="dropdown pl-6 mt-2 space-y-1">
                                    <li className="icon-item">
                                    <Link
                                        href="/user-management"
                                        className="flex items-center space-x-2 w-full"
                                    >
                                        <UsersIcon className="w-5 h-5" />
                                        <span className="icon-text dropdown-text">User Management</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link href="/billing" className="flex items-center space-x-2 w-full">
                                        <CreditCardIcon className="w-5 h-5" />
                                        <span className="icon-text dropdown-text">Billing</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link
                                        href="/support-tools"
                                        className="flex items-center space-x-2 w-full"
                                    >
                                        <SettingsIcon className="w-5 h-5" />
                                        <span className="icon-text dropdown-text">Support Tools</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link
                                        href="/compliance"
                                        className="flex items-center space-x-2 w-full"
                                    >
                                        <ShieldIcon className="w-5 h-5" />
                                        <span className="icon-text dropdown-text">Compliance</span>
                                    </Link>
                                    </li>

                                    <li className="icon-item">
                                    <Link href="/audit-log" className="flex items-center space-x-2 w-full">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-file-text"
                                        >
                                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                        <path d="M10 9H8" />
                                        <path d="M16 13H8" />
                                        <path d="M16 17H8" />
                                        </svg>
                                        <span className="icon-text dropdown-text">Audit Log</span>
                                    </Link>
                                    </li>
                                </ul>
                                )}
                            </li>
                        </ul>

                    </ul>

                </div>
                <div className="my-account">
                    <div className="my-account-info" id='account'>
                        <img src="/assets/images/user-icon.png" alt="User Icon" />
                        <span className="my-account-text">My Account</span>
                    </div>
                    <hr />
                    <div className="my-account-info" id='logout'>
                        {/* <img src="/assets/images/user-icon.png" alt="User Icon" /> */}
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span className="my-account-text">LogOut</span>
                    </div>
                </div>
            </div>
        </div>
    );
}