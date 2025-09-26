'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import React from 'react'

import '../styles/dashboard.css'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// Type definitions
type LayoutType = 'facecam-top' | 'facecam-bottom' | 'fullscreen' | 'split' | 'floating'
type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center-center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

interface OverlayPositions {
    [fileName: string]: Position
}

export default function MyPreferences() {
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
    clearAuthToken();
    
    // Redirect to login
    router.push('/auth/login')
  }

  //new code
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('facecam-bottom');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
      'overlay_top.png',
      'sponsor_logo.png',
      'border_frame.png'
  ]);
  const [overlayPositions, setOverlayPositions] = useState<OverlayPositions>({
      'overlay_top.png': 'top-left',
      'sponsor_logo.png': 'center-center',
      'border_frame.png': 'bottom-right'
  });
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const layoutLabels: Record<LayoutType, string> = {
      'facecam-top': 'Facecam top third / gameplay below',
      'facecam-bottom': 'Facecam bottom third / gameplay above',
      'fullscreen': 'Full-screen gameplay',
      'split': 'Side-by-side (split screen)',
      'floating': 'Floating facecam overlay'
  };

  const handleLayoutSelect = (layoutType: LayoutType) => {
      setSelectedLayout(layoutType);
  };

  const handleUploadAreaClick = () => {
      fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(true);
  };

  const handleDragLeave = () => {
      setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer?.files) {
          handleFiles(e.dataTransfer.files);
      }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          handleFiles(e.target.files);
      }
  };

  const handleFiles = (files: FileList) => {
      if (files) {
          Array.from(files).forEach(file => {
              if (file.type === 'image/png' && file.size <= 10 * 1024 * 1024) {
                  addFileItem(file.name);
              } else {
                  alert('Please upload PNG files under 10MB');
              }
          });
      }
  };

  const addFileItem = (fileName: string) => {
      if (!uploadedFiles.includes(fileName)) {
          setUploadedFiles(prev => [...prev, fileName]);
          setOverlayPositions(prev => ({ ...prev, [fileName]: 'top-left' }));
      }
  };

  const deleteFile = (fileName: string) => {
      setUploadedFiles(prev => prev.filter(file => file !== fileName));
      setOverlayPositions(prev => {
          const newPositions = { ...prev };
          delete newPositions[fileName];
          return newPositions;
      });
  };

  const handlePositionSelect = (fileName: string, position: Position) => {
      setOverlayPositions(prev => ({ ...prev, [fileName]: position }));
  };

  const positions: Position[] = [
      'top-left', 'top-center', 'top-right',
      'center-left', 'center-center', 'center-right',
      'bottom-left', 'bottom-center', 'bottom-right'
  ];

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
                                <h2 className="page-title">My Preferences</h2>
                            </div>

            {/* Clip Layout Style */}
            <div className="section">
                <h2>Clip layout style</h2>
                <div className="layout-options">
                    <div 
                        className={`layout-option facecam-top ${selectedLayout === 'facecam-top' ? 'selected' : ''}`}
                        onClick={() => handleLayoutSelect('facecam-top')}
                        title="Facecam top third / gameplay below"
                    ></div>
                    <div 
                        className={`layout-option facecam-bottom ${selectedLayout === 'facecam-bottom' ? 'selected' : ''}`}
                        onClick={() => handleLayoutSelect('facecam-bottom')}
                        title="Facecam bottom third / gameplay above"
                    ></div>
                    <div 
                        className={`layout-option fullscreen ${selectedLayout === 'fullscreen' ? 'selected' : ''}`}
                        onClick={() => handleLayoutSelect('fullscreen')}
                        title="Full-screen gameplay"
                    ></div>
                    <div 
                        className={`layout-option split ${selectedLayout === 'split' ? 'selected' : ''}`}
                        onClick={() => handleLayoutSelect('split')}
                        title="Side-by-side (split screen)"
                    ></div>
                    <div 
                        className={`layout-option floating ${selectedLayout === 'floating' ? 'selected' : ''}`}
                        onClick={() => handleLayoutSelect('floating')}
                        title="Floating facecam overlay"
                    ></div>
                </div>
                <div className="layout-preview">
                    <div className="preview-text">
                        Layout Preview: {layoutLabels[selectedLayout]}
                    </div>
                </div>
            </div>

            {/* Branding Upload */}
            <div className="section">
                <h2>Branding upload</h2>
                <div 
                    className={`upload-area ${dragOver ? 'dragover' : ''}`}
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="upload-icon">+</div>
                    <div className="upload-text">Upload image</div>
                    <div className="upload-subtext">PNG files up to 10MB, max 2160px wide</div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".png" 
                    multiple
                    onChange={handleFileInputChange}
                />
                
                <div className="uploaded-files">
                    {uploadedFiles.map((fileName) => (
                        <div key={fileName} className="file-item">
                            <span className="file-name">{fileName}</span>
                            <button 
                                className="delete-btn"
                                onClick={() => deleteFile(fileName)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay Placement */}
            <div className="section overlay-section">
                <h2>Overlay placement</h2>
                <div className="overlay-grid">
                    {uploadedFiles.map((fileName) => (
                        <div key={fileName} className="overlay-item">
                            <h3>{fileName}</h3>
                            <div className="position-grid">
                                {positions.map((position) => (
                                    <div 
                                        key={position}
                                        className={`position-option ${overlayPositions[fileName] === position ? 'selected' : ''}`}
                                        onClick={() => handlePositionSelect(fileName, position)}
                                    >
                                        <div className="position-dot"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
       
                            
                        </div>
                                        
    //                 </div>
    //             </div>
    //         </main>

    // </div>

  )
}