'use client'

import { clearAuthToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

// import './dashboard.css'
import './styles/dashboard.css';

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

//slider
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState, useEffect } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Define types for Swiper
interface SwiperBreakpoint {
  slidesPerView: number;
}

// Use any for breakpoints to avoid TypeScript conflicts with Swiper types
type SwiperBreakpoints = any;

// Define Swiper instance type
interface SwiperInstance {
  realIndex: number;
}

// Define breakpoint params type - use any to avoid conflicts
type BreakpointParams = any;

export default function DashboardPage() {
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

  //slider - separate states for each slider
  const [currentSlide1, setCurrentSlide1] = useState<number>(1);
  const [currentSlide2, setCurrentSlide2] = useState<number>(1);
  const [currentSlidesPerView1, setCurrentSlidesPerView1] = useState<number>(5);
  const [currentSlidesPerView2, setCurrentSlidesPerView2] = useState<number>(5);
  const totalSlides: number = 9; // Total number of slides

  // Function to calculate total pages based on slides per view
  // Function to calculate total pages (just show total slides)
  const getTotalPages = (totalSlides: number): number => {
    return totalSlides;
  };

  // Responsive breakpoints for Swiper
  const swiperBreakpoints: any = {
    1700: { slidesPerView: 5 },
    1281: { slidesPerView: 4 },
    1081: { slidesPerView: 3 },
    769: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  };

  // Handle slide change for first swiper
  const handleSlideChange1 = (swiper: any) => {
    setCurrentSlide1(swiper.realIndex + 1);
  };

  // Handle slide change for second swiper
  const handleSlideChange2 = (swiper: any) => {
    setCurrentSlide2(swiper.realIndex + 1);
  };

  // Handle breakpoint change for first swiper
  const handleBreakpoint1 = (swiper: any, breakpointParams: any) => {
    setCurrentSlidesPerView1(breakpointParams.slidesPerView || 5);
  };

  // Handle breakpoint change for second swiper
  const handleBreakpoint2 = (swiper: any, breakpointParams: any) => {
    setCurrentSlidesPerView2(breakpointParams.slidesPerView || 5);
  };

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

                  <h2>Clip Review </h2>

                  {/* Controls Container */}
                  <div className="controls-container">

                    {/* Date Range Picker */}
                    {/* <div className="date-range-picker">
                      <label htmlFor="startDate">From:</label>
                      <input type="date" id="startDate" className="date-input" />
                      <label htmlFor="endDate">To:</label>
                      <input type="date" id="endDate" className="date-input" />
                    </div> */}

                    <div className="sort-dropdown">
                        <select id="clipScoreSort" className="sort-select" defaultValue="">
                          <option value="" hidden>Sort by Date</option>
                          <option value="highest">oldest to newest</option>
                          <option value="lowest"> newest to olderest</option>
                        </select>
                        <span className="sort-icon">
                          <i className="fa fa-caret-down"></i>
                        </span>
                    </div>

                    {/* Existing Sort Dropdown */}
                    <div className="sort-dropdown">
                      <select id="sort" className="sort-select" defaultValue="">
                        <option value="" hidden>Sort by Stream Session</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                      </select>
                      <span className="sort-icon">
                        <i className="fa fa-caret-down"></i>
                      </span>
                    </div>

                    {/* New Clip Scores Sort Dropdown */}
                    <div className="sort-dropdown">
                      <select id="clipScoreSort2" className="sort-select" defaultValue="">
                        <option value="" hidden>Sort by Clip Score</option>
                        <option value="highest">Highest to Lowest</option>
                        <option value="lowest">Lowest to Highest</option>
                      </select>
                      <span className="sort-icon">
                        <i className="fa fa-caret-down"></i>
                      </span>
                    </div>

                    {/* Reset/Clear Filters Button */}
                    <button className="reset-btn" id="resetFilters">
                      <i className="fa fa-refresh"></i>
                      Reset Filters
                    </button>

                  </div>

                </div>

                <div className="clip-review-list">
                        {/* <!-- Aug 3 Stream --> */}
                        <section className="clip-section">
                            <h3>Aug 3 - Stream Title</h3>

                            <div className="clip-thumbnails swiper">
                                <Swiper
                                  modules={[Navigation]}
                                  spaceBetween={20}
                                  slidesPerView={5}
                                  breakpoints={swiperBreakpoints}
                                  navigation={{
                                    nextEl: '.swiper-button-next-1',
                                    prevEl: '.swiper-button-prev-1',
                                  }}
                                  loop={true}
                                  onSlideChange={handleSlideChange1}
                                  onBreakpoint={handleBreakpoint1}
                                  className="swiper-wrapper"
                                >
                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>

                                  <SwiperSlide className="clip-thumbnail swiper-slide">
                                    <a className="thumbnail-placeholder" href="/clip-review">
                                      <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                    </a>
                                    <div className="clip-info">
                                      <div className="clip-title">
                                        <h3>
                                          <a href="/clip-review">
                                            Existing Clip Title
                                          </a>
                                        </h3>
                                      </div>
                                      <div className="clip-meta">
                                        <button className="clip-approve">
                                          <a href="#">💜</a>
                                        </button>
                                        <button className="clip-reject">
                                          <a href="#">❌</a>
                                        </button>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                </Swiper>
                                
                                {/* Custom pagination showing current/total */}
                                <div className="swiper-pagination-custom">
                                  {currentSlide1} / {getTotalPages(totalSlides)}
                                </div>

                                <div className="swiper-button-prev-1">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <div className="swiper-button-next-1">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                            </div>

                        </section>

                        {/* <!-- Aug 2 Stream --> */}
                        <section className="clip-section">
                            <h3>Aug 2 - Stream Title</h3>

                            <div className="clip-thumbnails swiper">
                              <Swiper
                                modules={[Navigation]}
                                spaceBetween={20}
                                slidesPerView={5}
                                breakpoints={swiperBreakpoints}
                                navigation={{
                                  nextEl: '.swiper-button-next-2',
                                  prevEl: '.swiper-button-prev-2',
                                }}
                                loop={true}
                                onSlideChange={handleSlideChange2}
                                onBreakpoint={handleBreakpoint2}
                                className="swiper-wrapper"
                              >
                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>

                                <SwiperSlide className="clip-thumbnail swiper-slide">
                                  <a className="thumbnail-placeholder" href="/clip-review">
                                    <img src="/assets/images/thumbnail-default.jpg" alt="Clip Thumbnail" />
                                  </a>
                                  <div className="clip-info">
                                    <div className="clip-title">
                                      <h3>
                                        <a href="/clip-review">
                                          Existing Clip Title
                                        </a>
                                      </h3>
                                    </div>
                                    <div className="clip-meta">
                                      <button className="clip-approve">
                                        <a href="#">💜</a>
                                      </button>
                                      <button className="clip-reject">
                                        <a href="#">❌</a>
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              </Swiper>
                              
                              {/* Custom pagination showing current/total */}
                              <div className="swiper-pagination-custom">
                                {currentSlide2} / {getTotalPages(totalSlides)}
                              </div>
                              <div className="swiper-button-prev-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div className="swiper-button-next-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>

                        </section>
                </div>

                <ul className="pagination">
                  <li><a href="#" className="disabled">‹</a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#" className="active">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">›</a></li>
                </ul>
      
            </div>

          </div>
        </div>
      </main>

    </div>
  
  )
}